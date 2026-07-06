import { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { DishSummary, ReviewsList } from "../components/platDetail";
import { getChefStats, getPlatById } from "../services/platService";
import { getReviews, addReview } from "../services/reviewService";
import Button from "../components/ui/Button";
import Loader from "../components/ui/Loader";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { supabase } from "../services/supabase";
import { toast } from "react-toastify";

function PlatDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);
  const [dish, setDish] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- Avis dynamiques ---
  const [reviews, setReviews] = useState([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);
  const [submittingReview, setSubmittingReview] = useState(false);

  // Charger les avis depuis Supabase
  const fetchReviews = useCallback(async () => {
    try {
      setReviewsLoading(true);
      const data = await getReviews(id);
      setReviews(data || []);
    } catch (err) {
      console.error("Erreur chargement avis:", err);
      setReviews([]);
    } finally {
      setReviewsLoading(false);
    }
  }, [id]);

  // Vérifier si le plat est dans les favoris de l'utilisateur
  useEffect(() => {
    async function checkFavorite() {
      if (!user) {
        setIsFavorite(false);
        return;
      }
      try {
        const { data, error } = await supabase
          .from("favoris")
          .select("id")
          .eq("utilisateur_id", user.id)
          .eq("plat_id", id)
          .maybeSingle();

        setIsFavorite(!!data && !error);
      } catch (err) {
        console.error("Erreur vérification favori:", err);
        setIsFavorite(false);
      }
    }

    checkFavorite();
  }, [id, user]);

  useEffect(() => {
    async function chargerPlat() {
      const { data, error } = await getPlatById(id);

      if (error || !data) {
        console.error("Erreur chargement plat:", error);
        setLoading(false);
        return;
      }

      let chefStats = { rating: 0, reviewsCount: 0, dishesCount: 0 };
      try {
        chefStats = await getChefStats(data.vendeur_id);
      } catch (err) {
        console.error("Erreur chargement stats chef:", err);
      }

      const dishTransforme = {
        id: data.id,
        sellerId: data.vendeur_id,
        name: data.titre,
        image: data.image_url,
        price: data.prix,
        rating: 0, // sera recalculé dynamiquement ci-dessous
        reviews: 0, // sera recalculé dynamiquement ci-dessous
        distance: "0 km",
        prepTime: data.temps_preparation || "Non spécifié",
        description: data.description,
        ingredients: data.ingredients && data.ingredients.length > 0 ? data.ingredients : ["Ingrédients frais", "Épices maison", "Recette artisanale"],
        allergens: data.allergenes || [],
        servings: data.portions || "Non spécifié",
        chef: {
          name: data.profiles?.nom_complet || "Vendeur inconnu",
          avatar: data.profiles?.avatar || "",
          rating: chefStats.rating,
          reviewsCount: chefStats.reviewsCount,
          dishesCount: chefStats.dishesCount,
        },
      };

      setDish(dishTransforme);
      setLoading(false);
    }

    chargerPlat();
    fetchReviews();
  }, [id, fetchReviews]);

  // Écouter les changements en temps réel sur la table avis pour ce plat
  useEffect(() => {
    const channel = supabase
      .channel(`avis-realtime-${id}`)
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "avis",
          filter: `plat_id=eq.${id}`,
        },
        () => {
          // Recharger les avis lors de tout changement (INSERT, UPDATE, DELETE)
          fetchReviews();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [id, fetchReviews]);

  // Calculer la note moyenne et le nombre d'avis dynamiquement
  const totalReviews = reviews.length;
  const averageRating =
    totalReviews > 0
      ? parseFloat(
          (reviews.reduce((sum, r) => sum + r.note, 0) / totalReviews).toFixed(
            1,
          ),
        )
      : 0;

  // Injecter les valeurs dynamiques dans l'objet dish
  const dishWithRatings = dish
    ? { ...dish, rating: averageRating, reviews: totalReviews }
    : null;

  // Formater les avis pour le composant ReviewsList
  const formattedReviews = reviews.map((review) => {
    const createdAt = new Date(review.created_at);
    const now = new Date();
    const diffMs = now - createdAt;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    let dateLabel;
    if (diffDays === 0) dateLabel = "Aujourd'hui";
    else if (diffDays === 1) dateLabel = "Hier";
    else if (diffDays < 7) dateLabel = `Il y a ${diffDays} jours`;
    else if (diffDays < 30)
      dateLabel = `Il y a ${Math.floor(diffDays / 7)} semaine${Math.floor(diffDays / 7) > 1 ? "s" : ""}`;
    else if (diffDays < 365)
      dateLabel = `Il y a ${Math.floor(diffDays / 30)} mois`;
    else
      dateLabel = `Il y a ${Math.floor(diffDays / 365)} an${Math.floor(diffDays / 365) > 1 ? "s" : ""}`;

    return {
      id: review.id,
      author: review.profiles?.nom_complet || "Utilisateur anonyme",
      avatar: review.profiles?.avatar || "",
      rating: review.note,
      date: dateLabel,
      comment: review.commentaire,
    };
  });

  // Soumission d'un avis — retourne true si succès, false sinon
  const handleSubmitReview = async (note, commentaire) => {
    if (!user) {
      toast.error("Vous devez être connecté pour laisser un avis.");
      return false;
    }

    try {
      setSubmittingReview(true);
      await addReview(id, user.id, note, commentaire);
      toast.success("Votre avis a été publié avec succès !");
      await fetchReviews();
      return true;
    } catch (err) {
      console.error("Erreur soumission avis:", err);
      if (err.message?.includes("duplicate") || err.code === "23505") {
        toast.error("Vous avez déjà laissé un avis pour ce plat.");
      } else {
        toast.error("Erreur lors de la publication de votre avis.");
      }
      return false;
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleToggleFavorite = async () => {
    if (!user) {
      toast.error("Vous devez être connecté pour ajouter un plat aux favoris.");
      return;
    }

    try {
      if (isFavorite) {
        const { error } = await supabase
          .from("favoris")
          .delete()
          .eq("utilisateur_id", user.id)
          .eq("plat_id", id);
        if (error) throw error;
        setIsFavorite(false);
        toast.success("Retiré des favoris !");
      } else {
        const { error } = await supabase
          .from("favoris")
          .insert({
            utilisateur_id: user.id,
            plat_id: id,
          });
        if (error) throw error;
        setIsFavorite(true);
        toast.success("Ajouté aux favoris !");
      }
    } catch (err) {
      console.error("Erreur toggle favori:", err);
      toast.error("Impossible de modifier les favoris.");
    }
  };

  const handleDecrease = () => {
    setQuantity((currentQuantity) => Math.max(1, currentQuantity - 1));
  };

  const handleIncrease = () => {
    setQuantity((currentQuantity) => currentQuantity + 1);
  };

  const handleAddToCart = async () => {
    await addToCart(id, quantity);
    navigate("/panier");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background-warm">
        <Loader text="Chargement du plat..." />
      </div>
    );
  }

  if (!dish) {
    return (
      <div className="bg-background-warm px-4 py-16 sm:px-6 lg:px-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-border-warm bg-white p-8 text-center">
          <h1 className="mb-3 font-poppins text-3xl font-semibold text-foreground">
            Plat introuvable
          </h1>
          <p className="mb-6 text-muted-foreground">
            Ce plat n'existe pas ou n'est plus disponible.
          </p>
          <Button to="/plats" variant="primary" className="h-12 px-6">
            Retour au catalogue
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-background-warm px-3 py-6 sm:px-6 sm:py-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <section className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,0.9fr)] lg:gap-8">
          <div className="aspect-[4/3] overflow-hidden rounded-2xl bg-white sm:aspect-square">
            <img
              src={dishWithRatings.image}
              alt={dishWithRatings.name}
              className="h-full w-full object-cover"
            />
          </div>

          <DishSummary
            dish={dishWithRatings}
            isFavorite={isFavorite}
            onAddToCart={handleAddToCart}
            onDecrease={handleDecrease}
            onIncrease={handleIncrease}
            onToggleFavorite={handleToggleFavorite}
            quantity={quantity}
          />
        </section>

        <ReviewsList
          reviews={formattedReviews}
          totalReviews={totalReviews}
          averageRating={averageRating}
          reviewsLoading={reviewsLoading}
          isLoggedIn={!!user}
          userId={user?.id}
          dishId={id}
          sellerId={dishWithRatings.sellerId}
          dishName={dishWithRatings.name}
          onSubmitReview={handleSubmitReview}
          submittingReview={submittingReview}
        />
      </div>
    </div>
  );
}

export default PlatDetail;
