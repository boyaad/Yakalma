import { createContext, useContext, useEffect, useState, useCallback, useMemo } from "react";
import { supabase } from "../services/supabase";
import { useAuth } from "./AuthContext";
import { toast } from "react-toastify";

const AdminInfoContext = createContext();

function formatDate(value) {
  if (!value) return "Date non renseignée";
  return new Date(value).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric",
  });
}

function normalizeStatus(status) {
  const map = {
    en_cours: "open",
    ouvert: "open",
    investigating: "investigating",
    resolu: "resolved",
    résolu: "resolved",
    resolved: "resolved",
    ferme: "closed",
    fermé: "closed",
    closed: "closed",
  };
  return map[status?.toLowerCase()] || "open";
}

export default function AdminInfoProvider({ children }) {
  const { profile } = useAuth();
  const [users, setUsers] = useState([]);
  const [usersLoading, setUsersLoading] = useState(true);
  const [sellers, setSellers] = useState([]);
  const [sellersLoading, setSellersLoading] = useState(true);
  const [plats, setPlats] = useState([]);
  const [platsLoading, setPlatsLoading] = useState(true);
  const [commandes, setCommandes] = useState([]);
  const [commandesLoading, setCommandesLoading] = useState(true);
  const [signalements, setSignalements] = useState([]);
  const [signalementsLoading, setSignalementsLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = profile?.role === "admin";

  const fetchUsers = useCallback(async (background = false) => {
    if (!isAdmin) return;
    try {
      if (!background) setUsersLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

      const normalized = (data || []).map((u) => ({
        ...u,
        status: u.status === true || u.status === "active" ? "active" : "suspended",
      }));
      setUsers(normalized);
    } catch (err) {
      console.error("Erreur fetchUsers:", err);
      toast.error("Impossible de charger les utilisateurs.");
    } finally {
      if (!background) setUsersLoading(false);
    }
  }, [isAdmin]);

  const fetchSellers = useCallback(async (background = false) => {
    if (!isAdmin) return;
    try {
      if (!background) setSellersLoading(true);
      const { data: profiles, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("role", "vendeur");

      if (error) throw error;

      const sellerIds = (profiles || []).map((p) => p.user_id).filter(Boolean);

      let dishesCountMap = {};
      let ordersCountMap = {};
      let revenueMap = {};

      if (sellerIds.length > 0) {
        const { data: platsData } = await supabase
          .from("plats")
          .select("id, vendeur_id, prix")
          .in("vendeur_id", sellerIds);

        if (platsData) {
          platsData.forEach((p) => {
            dishesCountMap[p.vendeur_id] = (dishesCountMap[p.vendeur_id] || 0) + 1;
          });
        }

        const { data: ordersData } = await supabase
          .from("commandes")
          .select("vendeur_id, total, order_status")
          .in("vendeur_id", sellerIds);

        if (ordersData) {
          ordersData.forEach((o) => {
            ordersCountMap[o.vendeur_id] = (ordersCountMap[o.vendeur_id] || 0) + 1;
            if (o.order_status === "livre" || o.order_status === "delivered") {
              revenueMap[o.vendeur_id] = (revenueMap[o.vendeur_id] || 0) + Number(o.total);
            }
          });
        }
      }

      const enriched = (profiles || []).map((p) => ({
        id: p.user_id,
        name: p.nom_complet || "Inconnu",
        email: p.email || "",
        telephone: p.telephone || "",
        localisation: p.localisation || "",
        avatar: p.avatar || "",
        dishes: dishesCountMap[p.user_id] || 0,
        orders: ordersCountMap[p.user_id] || 0,
        revenue: `${(revenueMap[p.user_id] || 0).toFixed(0)} FCFA`,
        rating: 0,
        status: p.status === true || p.status === "active" || p.status === "verified" ? "active" : "suspended",
      }));

      setSellers(enriched);
    } catch (err) {
      console.error("Erreur fetchSellers:", err);
      toast.error("Impossible de charger les vendeurs.");
    } finally {
      if (!background) setSellersLoading(false);
    }
  }, [isAdmin]);

  const fetchPlats = useCallback(async (background = false) => {
    if (!isAdmin) return;
    try {
      if (!background) setPlatsLoading(true);
      const { data, error } = await supabase
        .from("plats")
        .select(`
          *,
          profiles ( nom_complet ),
          avis ( note )
        `)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const enriched = (data || []).map((p) => {
        const notes = (p.avis || []).map((a) => a.note).filter(Boolean);
        const avgRating = notes.length
          ? Math.round((notes.reduce((s, n) => s + n, 0) / notes.length) * 10) / 10
          : 0;
        return {
          id: p.id,
          name: p.titre || "Sans titre",
          chef: p.profiles?.nom_complet || "Inconnu",
          image: p.image_url || "",
          price: Number(p.prix) || 0,
          status: p.disponibilite ? "active" : "inactive",
          orders: 0,
          rating: avgRating,
        };
      });

      setPlats(enriched);
    } catch (err) {
      console.error("Erreur fetchPlats:", err);
      toast.error("Impossible de charger les plats.");
    } finally {
      if (!background) setPlatsLoading(false);
    }
  }, [isAdmin]);

  const fetchCommandes = useCallback(async (background = false) => {
    if (!isAdmin) return;
    try {
      if (!background) setCommandesLoading(true);
      const { data, error } = await supabase
        .from("commandes")
        .select(`
          *,
          ligne_commandes (
            id,
            plat_id,
            quantite,
            sous_total,
            plats (
              id,
              titre,
              prix,
              image_url
            )
          )
        `)
        .order("date_creation", { ascending: false })
        .limit(100);

      if (error) throw error;

      const userIds = [...new Set((data || []).flatMap((o) => [o.utilisateur_id, o.vendeur_id].filter(Boolean)))];
      let profilesMap = {};

      if (userIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, nom_complet, telephone, localisation")
          .in("user_id", userIds);

        if (profiles) {
          profiles.forEach((p) => {
            profilesMap[p.user_id] = p;
          });
        }
      }

      const formatted = (data || []).map((o) => {
        const buyerProfile = profilesMap[o.utilisateur_id] || {};
        const sellerProfile = profilesMap[o.vendeur_id] || {};
        const totalItems = o.ligne_commandes?.reduce((sum, line) => sum + (line.quantite || 0), 0) || 0;
        const dishSummary = o.ligne_commandes?.map((line) => `${line.plats?.titre || "Plat"} (x${line.quantite})`).join(", ") || "Commande";

        return {
          id: `CMD-${String(o.id).slice(0, 4).toUpperCase()}`,
          orderId: o.id,
          customerId: o.utilisateur_id,
          sellerId: o.vendeur_id,
          customer: buyerProfile.nom_complet || "Client inconnu",
          customerPhone: buyerProfile.telephone || "",
          customerLocation: buyerProfile.localisation || "",
          seller: sellerProfile.nom_complet || "Vendeur inconnu",
          sellerPhone: sellerProfile.telephone || "",
          sellerLocation: sellerProfile.localisation || "",
          dish: dishSummary,
          totalItems,
          total: Number(o.total) || 0,
          status: o.order_status || "pending",
          date: formatDate(o.date_creation),
          rawDate: o.date_creation,
          ligne_commandes: o.ligne_commandes || [],
        };
      });

      setCommandes(formatted);
    } catch (err) {
      console.error("Erreur fetchCommandes:", err);
      toast.error("Impossible de charger les commandes.");
    } finally {
      if (!background) setCommandesLoading(false);
    }
  }, [isAdmin]);

  const fetchSignalements = useCallback(async (background = false) => {
    if (!isAdmin) return;
    try {
      if (!background) setSignalementsLoading(true);
      const { data, error } = await supabase
        .from("signalements")
        .select(`
          *,
          plats ( titre )
        `)
        .order("date_creation", { ascending: false })
        .limit(100);

      if (error) throw error;

      const allUserIds = [...new Set((data || []).flatMap((r) => [r.utilisateur_id, r.vendeur_id].filter(Boolean)))];
      let profilesMap = {};

      if (allUserIds.length > 0) {
        const { data: profiles } = await supabase
          .from("profiles")
          .select("user_id, nom_complet")
          .in("user_id", allUserIds);

        if (profiles) {
          profiles.forEach((p) => {
            profilesMap[p.user_id] = p.nom_complet;
          });
        }
      }

      const formatted = (data || []).map((r) => ({
        id: r.id,
        reporterId: r.utilisateur_id,
        reporter: profilesMap[r.utilisateur_id] || "Utilisateur inconnu",
        targetType: r.type_signalement,
        target: r.cible_nom || (r.type_signalement === "Plat" ? r.plats?.titre || "Plat" : profilesMap[r.vendeur_id] || "Signalé"),
        platId: r.plat_id,
        sellerId: r.vendeur_id,
        reason: r.objet || r.type_signalement,
        description: r.description || "",
        status: normalizeStatus(r.statut),
        response: r.reponse_yakalma || "",
        date: formatDate(r.date_creation),
        rawDate: r.date_creation,
      }));

      setSignalements(formatted);
    } catch (err) {
      console.error("Erreur fetchSignalements:", err);
      toast.error("Impossible de charger les signalements.");
    } finally {
      if (!background) setSignalementsLoading(false);
    }
  }, [isAdmin]);

  const updateUserStatus = useCallback(async (userId, newStatus) => {
    setActionLoading(true);
    const dbStatus = newStatus === "active";
    try {
      const { data, error } = await supabase
        .from("profiles")
        .update({ status: dbStatus })
        .eq("user_id", userId)
        .select("user_id");

      if (error) throw error;

      if (!data || data.length === 0) {
        throw new Error("Aucune ligne modifiée. Vérifie la politique RLS.");
      }

      setUsers((prev) =>
        prev.map((u) =>
          u.user_id === userId ? { ...u, status: newStatus } : u
        )
      );
      setSellers((prev) =>
        prev.map((s) =>
          s.id === userId ? { ...s, status: newStatus } : s
        )
      );
      toast.success(`Utilisateur ${newStatus === "active" ? "activé" : "suspendu"} avec succès.`);
    } catch (err) {
      console.error("Erreur updateUserStatus:", err);
      toast.error(err.message || "Impossible de modifier le statut.");
    } finally {
      setActionLoading(false);
    }
  }, []);

  const updateReportStatus = useCallback(async (reportId, newStatus, responseText) => {
    setActionLoading(true);
    try {
      const payload = { statut: newStatus };
      if (responseText !== undefined) {
        payload.reponse_yakalma = responseText;
      }
      const { error } = await supabase
        .from("signalements")
        .update(payload)
        .eq("id", reportId);

      if (error) throw error;

      setSignalements((prev) =>
        prev.map((r) => {
          if (r.id !== reportId) return r;
          const updated = { ...r, status: normalizeStatus(newStatus) };
          if (responseText !== undefined) updated.response = responseText;
          return updated;
        })
      );

      const statusLabels = { open: "Ouvert", investigating: "En cours", resolved: "Résolu", closed: "Fermé" };
      toast.success(`Signalement ${statusLabels[newStatus] || newStatus} avec succès.`);
    } catch (err) {
      console.error("Erreur updateReportStatus:", err);
      toast.error("Impossible de mettre à jour le signalement.");
    } finally {
      setActionLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin) {
      fetchUsers();
      fetchSellers();
      fetchPlats();
      fetchCommandes();
      fetchSignalements();
    }
  }, [isAdmin, fetchUsers, fetchSellers, fetchPlats, fetchCommandes, fetchSignalements]);

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel("admin-realtime")
      .on("postgres_changes", { event: "*", schema: "public", table: "profiles" }, () => {
        fetchUsers(true);
        fetchSellers(true);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "plats" }, () => {
        fetchPlats(true);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "commandes" }, () => {
        fetchCommandes(true);
      })
      .on("postgres_changes", { event: "*", schema: "public", table: "signalements" }, () => {
        fetchSignalements(true);
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, fetchUsers, fetchSellers, fetchPlats, fetchCommandes, fetchSignalements]);

  const stats = useMemo(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    const totalUsers = users.length;
    const totalChefs = users.filter((u) => u.role === "vendeur").length;
    const monthlyOrders = commandes.filter((c) => new Date(c.rawDate) >= startOfMonth).length;
    const monthlyRevenue = commandes
      .filter((c) => {
        const d = new Date(c.rawDate);
        const paid = c.status === "livre" || c.status === "delivered" || c.status === "ready";
        return d >= startOfMonth && paid;
      })
      .reduce((sum, c) => sum + c.total, 0);

    const newToday = users.filter((u) => {
      const d = new Date(u.created_at);
      return d >= startOfDay;
    }).length;

    const activeReports = signalements.filter(
      (r) => r.status === "open" || r.status === "en_cours" || r.status === "investigating"
    ).length;

    return {
      totalUsers,
      totalChefs,
      monthlyOrders,
      monthlyRevenue,
      newToday,
      activeReports,
      pendingValidations: sellers.filter((s) => s.status === "pending").length,
    };
  }, [users, commandes, signalements, sellers]);

  const recentUsers = useMemo(() => {
    return users.slice(0, 5).map((u) => {
      const uid = u.user_id || u.id;
      const userOrders = commandes.filter((c) => c.customerId === uid);
      const totalSpent = userOrders
        .filter((c) => c.status === "livre" || c.status === "delivered" || c.status === "ready")
        .reduce((sum, c) => sum + c.total, 0);
      return {
        id: uid,
        name: u.nom_complet || "Inconnu",
        email: u.email || "",
        type: u.role === "vendeur" ? "Chef" : "Client",
        role: u.role,
        avatar: u.avatar || "",
        status: u.status || "active",
        telephone: u.telephone || "",
        localisation: u.localisation || "",
        createdAt: u.created_at ? formatDate(u.created_at) : "",
        user_id: uid,
        orders: userOrders.length,
        spent: `${totalSpent.toLocaleString()} FCFA`,
      };
    });
  }, [users, commandes]);

  const topSellers = useMemo(() => {
    return sellers.slice(0, 4).map((s) => {
      const sellerOrders = commandes.filter((c) => c.sellerId === s.id);
      const revenue = sellerOrders
        .filter((c) => c.status === "livre" || c.status === "delivered" || c.status === "ready")
        .reduce((sum, c) => sum + c.total, 0);
      return {
        ...s,
        orders: sellerOrders.length,
        revenue: `${revenue.toLocaleString()} FCFA`,
      };
    });
  }, [sellers, commandes]);

  return (
    <AdminInfoContext.Provider
      value={{
        users,
        usersLoading,
        sellers,
        sellersLoading,
        plats,
        platsLoading,
        commandes,
        commandesLoading,
        signalements,
        signalementsLoading,
        stats,
        recentUsers,
        topSellers,
        refreshUsers: fetchUsers,
        refreshSellers: fetchSellers,
        refreshPlats: fetchPlats,
        refreshCommandes: fetchCommandes,
        refreshSignalements: fetchSignalements,
        updateUserStatus,
        updateReportStatus,
        actionLoading,
      }}
    >
      {children}
    </AdminInfoContext.Provider>
  );
}

export function useAdmin() {
  const context = useContext(AdminInfoContext);
  if (!context) {
    throw new Error("useAdmin doit être utilisé dans un AdminInfoProvider");
  }
  return context;
}
