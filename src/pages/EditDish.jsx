import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { ImageUploader } from "../components/addDishe/Imageuploader";
import Input from "../components/ui/Input";
import Button from "../components/ui/Button";
import { toast } from "react-toastify";
import {
  getPlatById,
  updatePlat,
  uploadImagePlat,
  getCategories,
} from "../services/platService";
import { FALLBACK_CATEGORIES } from "../data/plats";
import { useSeller } from "../context/SellerInfoContext";

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

export default function EditDish() {
  const { id } = useParams(); // récupère l'id dans l'URL
  const navigate = useNavigate();
  const { refreshPlats } = useSeller();

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    category: "",
    description: "",
  });
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState([]);

  // Charger les données du plat au démarrage
  useEffect(() => {
    async function chargerPlat() {
      const { data, error } = await getPlatById(id);

      if (error) {
        console.error("Erreur chargement plat:", error);
        setLoading(false);
        return;
      }

      // Pré-remplir le formulaire avec les données existantes
      setFormData({
        name: data.titre || "",
        price: data.prix || "",
        category: data.categorie_id || "",
        description: data.description || "",
      });
      setImagePreview(data.image_url || null);
      setLoading(false);
    }

    chargerPlat();
  }, [id]);

  useEffect(() => {
    async function chargerCategories() {
      try {
        const { data, error } = await getCategories();
        if (!error && data && data.length > 0) {
          setCategories(data);
        } else {
          setCategories(FALLBACK_CATEGORIES);
        }
      } catch (err) {
        console.error("Erreur catégories, utilisation du fallback:", err);
        setCategories(FALLBACK_CATEGORIES);
      }
    }
    chargerCategories();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      let imageUrl = imagePreview;

      // Si l'image a été changée (base64), on uploade la nouvelle
      if (imagePreview && imagePreview.startsWith("data:")) {
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
        imageUrl = url;
      }

      const modifications = {
        titre: formData.name,
        description: formData.description,
        prix: Number(formData.price),
        image_url: imageUrl,
        categorie_id: formData.category || null,
      };

      const { error } = await updatePlat(id, modifications);

      if (error) {
        console.error("Erreur modification:", error);
        toast.error("Erreur lors de la modification");
        return;
      }

      toast.success("Plat modifié avec succès !");
      await refreshPlats();
      navigate("/seller/dishes");
    } catch (error) {
      console.error(error);
      toast.error("Une erreur est survenue");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Chargement du plat...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background px-3 py-6 sm:px-6 sm:py-8 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <Button
          to="/seller/dishes"
          variant="link"
          className="mb-6 font-medium text-primary p-0 h-auto"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour à mes plats
        </Button>

        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold sm:text-4xl">Modifier le plat</h1>
          <p className="text-base text-muted-foreground sm:text-lg">
            Modifiez les informations de votre plat
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <ImageUploader
            value={imagePreview}
            onChange={setImagePreview}
            error={null}
          />

          <div className="rounded-2xl bg-white p-4 shadow-sm sm:p-6">
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
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, name: e.target.value }))
                }
                placeholder="Ex: Thiéboudienne rouge"
              />

              <Input
                id="price"
                label="Prix (FCFA)"
                required
                type="number"
                value={formData.price}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, price: e.target.value }))
                }
                placeholder="2500"
              />

              <Input
                id="category"
                label="Catégorie"
                as="select"
                value={formData.category}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, category: e.target.value }))
                }
              >
                <option value="">Sélectionner une catégorie</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.nom}
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
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                placeholder="Décrivez votre plat..."
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              type="button"
              variant="secondary"
              className="flex-1 py-4"
              onClick={() => navigate("/seller/dishes")}
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
                  <span>Enregistrement...</span>
                </>
              ) : (
                <>
                  <CheckCircle className="w-5 h-5" />
                  <span>Enregistrer les modifications</span>
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
