import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ImageUploader } from "../components/addDishe/Imageuploader";
import { IngredientManager } from "../components/addDishe/Ingredientmanager";
import { AllergenSelector } from "../components/addDishe/Allergenselector";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { useAuth } from "../context/AuthContext";
import { addPlat, uploadImagePlat } from "../services/platService";
import { toast } from "react-toastify";
import { getCategories } from "../services/platService";
import { FALLBACK_CATEGORIES } from "../data/plats";
import { useSeller } from "../context/SellerInfoContext";

const INITIAL_FORM = {
  name: "",
  price: "",
  prepTime: "",
  servings: "",
  category: "",
  description: "",
};

function validateField(name, value) {
  switch (name) {
    case "name":
      return value.trim().length < 3
        ? "Le nom doit contenir au moins 3 caractères"
        : "";
    case "price":
      return !value || parseFloat(value) <= 0
        ? "Le prix doit être supérieur à 0"
        : "";
    case "description":
      return value.trim().length < 20
        ? "La description doit contenir au moins 20 caractères"
        : "";
    case "category":
      return !value ? "Sélectionnez une catégorie" : "";
    default:
      return "";
  }
}
function dataURLtoFile(dataUrl, nomFichier) {
  const [entete, base64] = dataUrl.split(",");
  const type = entete.match(/:(.*?);/)[1];
  const binaire = atob(base64);
  const tableau = new Uint8Array(binaire.length);
  for (let i = 0; i < binaire.length; i++) {
    tableau[i] = binaire.charCodeAt(i);
  }
  return new File([tableau], nomFichier, { type });
}

export default function AddDish() {
  const navigate = useNavigate();
  const { refreshPlats } = useSeller();

  const [formData, setFormData] = useState(INITIAL_FORM);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [imagePreview, setImagePreview] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [allergens, setAllergens] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { user } = useAuth();
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    async function chargerCategories() {
      try {
        const { data, error } = await getCategories();
        console.log("CATEGORIES =", data);
        if (error || !data || data.length === 0) {
          setCategories(FALLBACK_CATEGORIES);
        } else {
          setCategories(data);
        }
      } catch (err) {
        console.error("Erreur catégories, utilisation du fallback:", err);
        setCategories(FALLBACK_CATEGORIES);
      }
    }

    chargerCategories();
  }, []);

  function handleChange(field, value) {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (touched[field]) {
      setErrors((prev) => ({ ...prev, [field]: validateField(field, value) }));
    }
  }

  function handleBlur(field) {
    setTouched((prev) => ({ ...prev, [field]: true }));
    setErrors((prev) => ({
      ...prev,
      [field]: validateField(field, formData[field]),
    }));
  }

  async function handleSubmit(e) {
    e.preventDefault();

    const newErrors = {};

    Object.keys(formData).forEach((key) => {
      const error = validateField(key, formData[key]);

      if (error) {
        newErrors[key] = error;
      }
    });

    if (!imagePreview) {
      newErrors.image = "Une photo est requise";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      setIsSubmitting(true);
      const fichierImage = dataURLtoFile(
        imagePreview,
        `plat-${Date.now()}.jpg`,
      );
      const { url, error: uploadError } = await uploadImagePlat(fichierImage);

      if (uploadError) {
        console.error("Erreur upload image:", uploadError);
        toast.error("Erreur lors de l'upload de l'image");
        return;
      }
      const nouveauPlat = {
        vendeur_id: user.id,
        categorie_id: formData.category,
        titre: formData.name,
        description: formData.description,
        prix: Number(formData.price),
        image_url: url,
        disponibilite: true,
      };

      const { error } = await addPlat(nouveauPlat);

      if (error) {
        console.error(error);
        toast.error("Erreur lors de l'ajout du plat");
        return;
      }

      toast.success("Plat ajouté avec succès !");
      await refreshPlats();
      navigate("/seller/dishes");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen py-6 sm:py-8 px-4 sm:px-6 lg:px-8 bg-background">
      <div className="max-w-4xl mx-auto">
        {/* Back link */}
        <Button
          to="/seller/dashboard"
          variant="link"
          className="mb-6 font-medium text-primary p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour au dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl mb-2">Ajouter un nouveau plat</h1>
          <p className="text-muted-foreground text-lg">
            Remplissez les informations pour créer votre plat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Image */}
          <ImageUploader
            value={imagePreview}
            onChange={setImagePreview}
            error={errors.image}
          />

          {/* General info */}
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-6">
              Informations générales
            </h2>
            <div className="space-y-5">
              <Input
                id="name"
                label="Nom du plat"
                required
                type="text"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                onBlur={() => handleBlur("name")}
                placeholder="Ex: Couscous Royal"
                touched={touched.name}
                error={errors.name}
              />

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Input
                  id="price"
                  label="Prix (FCFA)"
                  required
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => handleChange("price", e.target.value)}
                  onBlur={() => handleBlur("price")}
                  placeholder="15.00"
                  touched={touched.price}
                  error={errors.price}
                />
                <Input
                  id="prepTime"
                  label="Temps de préparation"
                  type="text"
                  value={formData.prepTime}
                  onChange={(e) => handleChange("prepTime", e.target.value)}
                  placeholder="45 min"
                />
                <Input
                  id="servings"
                  label="Portions"
                  type="text"
                  value={formData.servings}
                  onChange={(e) => handleChange("servings", e.target.value)}
                  placeholder="2-3 pers."
                />
              </div>

              <Input
                id="category"
                label="Catégorie"
                required
                as="select"
                value={formData.category}
                onChange={(e) => handleChange("category", e.target.value)}
                onBlur={() => handleBlur("category")}
                touched={touched.category}
                error={errors.category}
              >
                <option value="">Sélectionner une catégorie</option>

                {categories.map((categorie) => (
                  <option key={categorie.id} value={categorie.id}>
                    {categorie.nom}
                  </option>
                ))}
              </Input>

              <Input
                id="description"
                label="Description"
                required
                as="textarea"
                rows={5}
                value={formData.description}
                onChange={(e) => handleChange("description", e.target.value)}
                onBlur={() => handleBlur("description")}
                placeholder="Décrivez votre plat en détail : ingrédients principaux, préparation, saveurs..."
                touched={touched.description}
                error={errors.description}
                helperText={`${formData.description.length} / 500 caractères`}
              />
            </div>
          </div>

          {/* Ingredients */}
          <IngredientManager
            value={ingredients}
            onChange={setIngredients}
            error={errors.ingredients}
          />

          {/* Allergens */}
          <AllergenSelector value={allergens} onChange={setAllergens} />

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 py-4"
              onClick={() => navigate("/seller/dashboard")}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              variant="primary"
              disabled={isSubmitting}
              className="flex-1 py-4"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Publication en cours...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Publier le plat</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
