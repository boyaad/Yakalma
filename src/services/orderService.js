import { supabase } from "./supabase";

export async function getOrders(userId) {
  return await supabase
    .from("commandes")
    .select("*")
    .eq("utilisateur_id", userId);
}

export async function checkoutCartToOrder(userId, total, vendeurId, adresseLabel, adresseLocalisation) {
  // 1. Récupérer les articles du panier
  const { data: cartItems, error: cartError } = await supabase
    .from("panier_articles")
    .select("*, plats(*)")
    .eq("utilisateur_id", userId);

  if (cartError) throw cartError;
  if (!cartItems || cartItems.length === 0) {
    throw new Error("Votre panier est vide");
  }

  // 2. Enregistrer l'adresse de livraison si elle est nouvelle
  if (adresseLabel && adresseLocalisation) {
    const { data: existingAddress, error: addressCheckError } = await supabase
      .from("adresses")
      .select("id")
      .eq("utilisateur_id", userId)
      .eq("label", adresseLabel)
      .eq("localisation", adresseLocalisation)
      .maybeSingle();

    if (!existingAddress && !addressCheckError) {
      const { error: insertAddressError } = await supabase
        .from("adresses")
        .insert([
          {
            utilisateur_id: userId,
            label: adresseLabel,
            localisation: adresseLocalisation,
            isDefault: false,
          },
        ]);
      if (insertAddressError) console.error("Erreur lors de l'enregistrement de l'adresse:", insertAddressError);
    }
  }

  // 3. Créer la commande
  const { data: order, error: orderError } = await supabase
    .from("commandes")
    .insert([
      {
        utilisateur_id: userId,
        vendeur_id: vendeurId || cartItems[0]?.plats?.vendeur_id,
        total: total,
        order_status: "en_attente",
      },
    ])
    .select()
    .single();

  if (orderError) throw orderError;

  // 4. Insérer les lignes de commande
  const lineItems = cartItems.map((item) => ({
    commande_id: order.id,
    plat_id: item.plat_id,
    quantite: item.quantite,
    sous_total: (item.plats?.prix || 0) * item.quantite,
  }));

  const { error: linesError } = await supabase
    .from("ligne_commandes")
    .insert(lineItems);

  if (linesError) {
    // Si l'insertion des lignes échoue, on tente de supprimer la commande créée pour éviter des données orphelines
    await supabase.from("commandes").delete().eq("id", order.id);
    throw linesError;
  }

  // 5. Nettoyer le panier
  const { error: clearError } = await supabase
    .from("panier_articles")
    .delete()
    .eq("utilisateur_id", userId);

  if (clearError) {
    console.error("Erreur lors du nettoyage du panier après commande:", clearError);
  }

  return order;
}

export async function updateOrderStatus(orderId, newStatus) {
  const { data, error } = await supabase
    .from("commandes")
    .update({ order_status: newStatus })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function deleteOrder(orderId) {
  // Vérifier que la commande est bien terminée avant de la supprimer
  const { data: order, error: fetchError } = await supabase
    .from("commandes")
    .select("order_status")
    .eq("id", orderId)
    .single();

  if (fetchError) throw fetchError;

  const terminatedStatuses = ["livre", "delivered", "annulee", "cancelled"];
  if (!terminatedStatuses.includes(order.order_status)) {
    throw new Error("Seules les commandes terminées ou annulées peuvent être supprimées.");
  }

  // Supprimer d'abord les lignes de commande associées
  const { error: linesDeleteError } = await supabase
    .from("ligne_commandes")
    .delete()
    .eq("commande_id", orderId);

  if (linesDeleteError) throw linesDeleteError;

  // Puis supprimer la commande
  const { error: deleteError } = await supabase
    .from("commandes")
    .delete()
    .eq("id", orderId);

  if (deleteError) throw deleteError;
}

export async function cancelOrder(orderId) {
  // On ne peut annuler une commande que si son statut est 'en_attente'
  const { data: order, error: fetchError } = await supabase
    .from("commandes")
    .select("order_status")
    .eq("id", orderId)
    .single();

  if (fetchError) throw fetchError;
  if (order.order_status !== "en_attente") {
    throw new Error("Seules les commandes en attente peuvent être annulées.");
  }

  const { data, error } = await supabase
    .from("commandes")
    .update({ order_status: "annulee" })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}

export async function hideOrder(orderId, isHidden) {
  const { data, error } = await supabase
    .from("commandes")
    .update({ masquee: isHidden })
    .eq("id", orderId)
    .select()
    .single();

  if (error) throw error;
  return data;
}


