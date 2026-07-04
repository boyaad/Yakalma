import {
  ArrowRight,
  MapPin,
  Phone,
  PictureInPicture,
  User,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { AccountTypeSelector } from "../components/auth/Accounttypeselector";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import { createProfile } from "../services/authService";
import { supabase } from "../services/supabase";

function validateName(name) {
  if (!name) return "Le nom est requis";
  if (name.length < 2) return "Le nom doit contenir au moins 2 caractères";
  return "";
}

function validateAvatar(avatar) {
  if (avatar) {
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/jpg"];

    if (!allowedTypes.includes(avatar.type)) {
      return "Format de fichier non supporté (jpeg, jpg, png, gif uniquement)";
    }

    if (avatar.size > 5 * 1024 * 1024) {
      return "Le fichier est trop volumineux (max 5MB)";
    }
  }
  return "";
}

function validatePhone(telephone) {
  const phoneRegex = /^(77|78|75|70)\d{7}$/;

  if (!telephone && !phoneRegex.test(telephone)) {
    return "Numéro de téléphone invalide";
  }

  return "";
}

function validateLocation(localisation) {
  if (localisation && localisation.length < 2) {
    return "La localisation doit contenir au moins 2 caractères";
  }

  return "";
}

export default function CreateProfile() {
  const [formData, setFormData] = useState({
    name: "",
    accountType: "acheteur",
    telephone: "",
    localisation: "",
  });

  const [avatar, setAvatar] = useState(null);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const initUser = async () => {
      // Récupère la session depuis l'URL si Supabase a redirigé avec un token
      try {
        await supabase.auth.getSessionFromUrl();
      } catch (err) {
        // Pas de session dans l'URL ou erreur non critique, on continue
      }
      const { data, error } = await supabase.auth.getUser();

      if (error || !data?.user) {
        toast.error("Utilisateur non connecté. Veuillez vous reconnecter.");
        navigate("/login");
        return;
      }

      setUser(data.user);

      const { data: profileData, error: profileError } = await supabase
        .from("profiles")
        .select("role")
        .eq("user_id", data.user.id)
        .maybeSingle();

      if (profileError) {
        toast.error(
          "Erreur lors de la vérification du profil : " +
            (profileError.message || String(profileError)),
        );
        return;
      }

      if (profileData) {
        const targetRoute =
          profileData.role === "vendeur" ? "/seller/dashboard" : "/";

        toast.info("Profil déjà existant. Redirection en cours...");
        navigate(targetRoute);
      }
    };

    initUser();
  }, [navigate]);

  const handleBlur = (field) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    switch (field) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          name: validateName(formData.name),
        }));
        break;

      case "avatar":
        setErrors((prev) => ({
          ...prev,
          avatar: validateAvatar(avatar),
        }));
        break;

      case "telephone":
        setErrors((prev) => ({
          ...prev,
          telephone: validatePhone(formData.telephone),
        }));
        break;

      case "localisation":
        setErrors((prev) => ({
          ...prev,
          localisation: validateLocation(formData.localisation),
        }));
        break;
    }
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      switch (field) {
        case "name":
          setErrors((prev) => ({
            ...prev,
            name: validateName(value),
          }));
          break;

        case "telephone":
          setErrors((prev) => ({
            ...prev,
            telephone: validatePhone(value),
          }));
          break;

        case "localisation":
          setErrors((prev) => ({
            ...prev,
            localisation: validateLocation(value),
          }));
          break;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateName(formData.name);
    const avatarError = validateAvatar(avatar);
    const telephoneError = validatePhone(formData.telephone);
    const localisationError = validateLocation(formData.localisation);

    if (nameError || avatarError || telephoneError || localisationError) {
      setErrors((prev) => ({
        ...prev,
        name: nameError,
        avatar: avatarError,
        telephone: telephoneError,
        localisation: localisationError,
      }));

      setTouched((prev) => ({
        ...prev,
        name: true,
        avatar: true,
        telephone: true,
        localisation: true,
      }));

      return;
    }

    if (!user?.id) {
      toast.error("Utilisateur non authentifié.");
      return;
    }

    try {
      setIsLoading(true);

      let avatarUrl = null;

      if (avatar) {
        const ext = avatar.name.split(".").pop();
        const filePath = `${user.id}/avatar.${ext}`;

        const { error: uploadError } = await supabase.storage
          .from("avatars")
          .upload(filePath, avatar, {
            upsert: true,
            contentType: avatar.type,
          });

        if (uploadError) {
          toast.error(
            "Erreur upload avatar : " +
              (uploadError.message || String(uploadError)),
          );
          return;
        }

        const { data } = supabase.storage
          .from("avatars")
          .getPublicUrl(filePath);

        avatarUrl = data.publicUrl;
      }

      const { data, error: profileError } = await createProfile(
        formData.name,
        formData.accountType,
        user.id,
        avatarUrl,
        formData.telephone,
        formData.localisation,
      );

      if (profileError) {
        toast.error(
          "Erreur profil : " +
            (profileError.message || "Impossible de créer le profil"),
        );
        return;
      }

      if (formData.accountType === "vendeur") {
        navigate("/seller/dashboard");
        return;
      }

      toast.success("Profil créé avec succès !");

      setFormData({
        name: "",
        accountType: "acheteur",
        telephone: "",
        localisation: "",
      });

      setAvatar(null);

      navigate("/");
    } catch (error) {
      toast.error("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex flex-col gap-4 justify-center items-center p-6">
      <AccountTypeSelector
        accountType={formData.accountType}
        onChange={(type) =>
          setFormData((prev) => ({
            ...prev,
            accountType: type,
          }))
        }
      />
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          id="avatar"
          label="Photo de profil"
          type="file"
          onChange={(e) => setAvatar(e.target.files?.[0])}
          onBlur={() => handleBlur("avatar")}
          touched={touched.avatar}
          error={errors.avatar}
          icon={<PictureInPicture className="w-5 h-5" />}
        />

        <Input
          id="name"
          label="Nom complet"
          type="text"
          value={formData.name}
          onChange={(e) => handleChange("name", e.target.value)}
          onBlur={() => handleBlur("name")}
          touched={touched.name}
          error={errors.name}
          icon={<User className="w-5 h-5" />}
        />

        <Input
          id="telephone"
          label="Numéro de téléphone"
          type="tel"
          value={formData.telephone}
          onChange={(e) => handleChange("telephone", e.target.value)}
          onBlur={() => handleBlur("telephone")}
          touched={touched.telephone}
          error={errors.telephone}
          icon={<Phone className="w-5 h-5" />}
        />

        <Input
          id="localisation"
          label="Localisation"
          type="text"
          value={formData.localisation}
          onChange={(e) => handleChange("localisation", e.target.value)}
          onBlur={() => handleBlur("localisation")}
          touched={touched.localisation}
          error={errors.localisation}
          icon={<MapPin className="w-5 h-5" />}
        />

        <Button
          type="submit"
          variant="primary"
          className="w-full mt-6"
          isLoading={isLoading}
        >
          <span>Créer mon profil</span>
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </form>
    </div>
  );
}
