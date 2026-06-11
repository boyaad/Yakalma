import {
  ArrowRight,
  ChefHat,
  Lock,
  Mail,
  MapPin,
  Phone,
  PictureInPicture,
  User,
} from "lucide-react";
import { useState } from "react";
import {
  Link,
  useNavigate,
} from "react-router-dom";

import { toast } from "react-toastify";
import { AccountTypeSelector } from "../components/auth/Accounttypeselector";
import { LeftPanel } from "../components/auth/Leftpanel";
import { TermsCheckbox } from "../components/auth/Termscheckbox";
import Button from "../components/ui/Button";
import Input from "../components/ui/Input";
import {
  createProfile,
  signUp,
} from "../services/authService";
import { supabase } from "../services/supabase";

function validateName(name) {
  if (!name)
    return "Le nom est requis";
  if (name.length < 2)
    return "Le nom doit contenir au moins 2 caractères";
  return "";
}

function validateEmail(
  email,
) {
  const emailRegex =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email)
    return "L'email est requis";
  if (!emailRegex.test(email))
    return "Email invalide";
  return "";
}

function validatePassword(
  password,
) {
  if (!password)
    return "Le mot de passe est requis";
  if (password.length < 8)
    return "Au moins 8 caractères requis";
  if (
    !/(?=.*[a-z])/.test(
      password,
    )
  )
    return "Doit contenir une minuscule";
  if (
    !/(?=.*[A-Z])/.test(
      password,
    )
  )
    return "Doit contenir une majuscule";
  if (
    !/(?=.*\d)/.test(password)
  )
    return "Doit contenir un chiffre";
  return "";
}

function validateConfirmPassword(
  confirmPassword,
  password,
) {
  if (!confirmPassword)
    return "Confirmez votre mot de passe";
  if (
    confirmPassword !==
    password
  )
    return "Les mots de passe ne correspondent pas";
  return "";
}

function validateAvatar(
  avatar,
) {
  if (avatar) {
    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/jpg",
    ];
    if (
      !allowedTypes.includes(
        avatar.type,
      )
    ) {
      return "Format de fichier non supporté (jpeg, jpg, png, gif uniquement)";
    } else if (
      avatar.size >
      5 * 1024 * 1024
    ) {
      return "Le fichier est trop volumineux (max 5MB)";
    }
  }
  return "";
}

function validatePhone(
  telephone,
) {
  // Numéro de téléphone sénégalais : peut commencer par 77 ou 78 ou 75 ou 70, suivi de 7 autres chiffres
  const phoneRegex =
    /^(77|78|75|70)\d{7}$/;
  if (
    telephone &&
    !phoneRegex.test(
      telephone,
    )
  ) {
    return "Numéro de téléphone invalide";
  }
  return "";
}

function validateLocation(
  localisation,
) {
  if (
    localisation &&
    localisation.length < 2
  ) {
    return "La localisation doit contenir au moins 2 caractères";
  }
  return "";
}

export default function Register() {
  const navigate =
    useNavigate();

  const [
    formData,
    setFormData,
  ] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    accountType: "customer",
    acceptTerms: false,
    avatar: "",
    telephone: "",
    localisation: "",
  });

  const [errors, setErrors] =
    useState({});
  const [
    touched,
    setTouched,
  ] = useState({});
  const [
    isLoading,
    setIsLoading,
  ] = useState(false);

  const handleBlur = (
    field,
  ) => {
    setTouched((prev) => ({
      ...prev,
      [field]: true,
    }));

    switch (field) {
      case "name":
        setErrors((prev) => ({
          ...prev,
          name: validateName(
            formData.name,
          ),
        }));
        break;
      case "email":
        setErrors((prev) => ({
          ...prev,
          email:
            validateEmail(
              formData.email,
            ),
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password:
            validatePassword(
              formData.password,
            ),
        }));
        if (
          touched.confirmPassword
        ) {
          setErrors(
            (prev) => ({
              ...prev,
              confirmPassword:
                validateConfirmPassword(
                  formData.confirmPassword,
                  formData.password,
                ),
            }),
          );
        }
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword:
            validateConfirmPassword(
              formData.confirmPassword,
              formData.password,
            ),
        }));
        break;
      case "avatar":
        setErrors((prev) => ({
          ...prev,
          avatar:
            validateAvatar(
              formData.avatar,
            ),
        }));
        break;
      case "telephone":
        setErrors((prev) => ({
          ...prev,
          telephone:
            validatePhone(
              formData.telephone,
            ),
        }));
        break;
      case "localisation":
        setErrors((prev) => ({
          ...prev,
          localisation:
            validateLocation(
              formData.localisation,
            ),
        }));
        break;
    }
  };

  const handleChange = (
    field,
    value,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (touched[field]) {
      switch (field) {
        case "name":
          setErrors(
            (prev) => ({
              ...prev,
              name: validateName(
                value,
              ),
            }),
          );
          break;
        case "email":
          setErrors(
            (prev) => ({
              ...prev,
              email:
                validateEmail(
                  value,
                ),
            }),
          );
          break;
        case "password":
          setErrors(
            (prev) => ({
              ...prev,
              password:
                validatePassword(
                  value,
                ),
            }),
          );
          if (
            touched.confirmPassword
          ) {
            setErrors(
              (prev) => ({
                ...prev,
                confirmPassword:
                  validateConfirmPassword(
                    formData.confirmPassword,
                    value,
                  ),
              }),
            );
          }
          break;
        case "confirmPassword":
          setErrors(
            (prev) => ({
              ...prev,
              confirmPassword:
                validateConfirmPassword(
                  value,
                  formData.password,
                ),
            }),
          );
          break;
        case "avatar":
          setErrors(
            (prev) => ({
              ...prev,
              avatar:
                validateAvatar(
                  value,
                ),
            }),
          );
          break;
        case "telephone":
          setErrors(
            (prev) => ({
              ...prev,
              telephone:
                validatePhone(
                  value,
                ),
            }),
          );
          break;
        case "localisation":
          setErrors(
            (prev) => ({
              ...prev,
              localisation:
                validateLocation(
                  value,
                ),
            }),
          );
          break;
      }
    }
  };

  const handleSubmit = async (
    e,
  ) => {
    e.preventDefault();

    const nameError =
      validateName(
        formData.name,
      );
    const emailError =
      validateEmail(
        formData.email,
      );
    const passwordError =
      validatePassword(
        formData.password,
      );
    const confirmPasswordError =
      validateConfirmPassword(
        formData.confirmPassword,
        formData.password,
      );
    const avatarError =
      validateAvatar(
        formData.avatar,
      );
    const telephoneError =
      validatePhone(
        formData.telephone,
      );
    const localisationError =
      validateLocation(
        formData.localisation,
      );

    if (
      !formData.acceptTerms
    ) {
      setErrors((prev) => ({
        ...prev,
        acceptTerms:
          "Vous devez accepter les conditions",
      }));
      return;
    }

    if (
      nameError ||
      emailError ||
      passwordError ||
      confirmPasswordError ||
      avatarError ||
      telephoneError ||
      localisationError
    ) {
      setErrors({
        name: nameError,
        email: emailError,
        password:
          passwordError,
        confirmPassword:
          confirmPasswordError,
        avatar: avatarError,
        telephone:
          telephoneError,
        localisation:
          localisationError,
      });
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        avatar: true,
        telephone: true,
        localisation: true,
      });
      return;
    }

    try {
      setIsLoading(true);
      // Créer le compte utilisateur avec Supabase Auth
      const { data, error } =
        await signUp(
          formData.email,
          formData.password,
        );

      if (error) {
        toast.error(
          "Erreur : " +
            (error.message ||
              String(error)),
        );
        return;
      }

      if (!data?.user?.id) {
        toast.error(
          "Erreur : ID utilisateur introuvable après inscription.",
        );
        return;
      }

      let avatarUrl = null;
      if (formData.avatar) {
        const {
          data: uploadData,
          error: uploadError,
        } =
          await supabase.storage
            .from("avatars")
            .upload(
              `avatars/${data.user.id}/${formData.avatar.name}`,
              formData.avatar,
            );
        if (uploadError) {
          toast.error(
            "Erreur lors de l'upload de l'avatar : " +
              (uploadError.message ||
                String(
                  uploadError,
                )),
          );
          return;
        }

        avatarUrl =
          supabase.storage
            .from("avatars")
            .getPublicUrl(
              uploadData.path,
            ).publicURL;
      }

      const {
        data: profileData,
        error: profileError,
      } = await createProfile(
        formData.name,
        formData.accountType,
        data.user.id,
        avatarUrl,
        formData.telephone,
        formData.localisation,
      );

      if (
        profileError ||
        !profileData
      ) {
        const errorMessage =
          profileError?.message ||
          "Impossible de créer le profil.";
        toast.error(
          "Erreur lors de la création du profil : " +
            errorMessage,
        );
        return;
      }

      toast.success(
        "Compte créé avec succès ! Veuillez vérifier votre email pour confirmer votre compte.",
      );
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        accountType:
          "customer",
        acceptTerms: false,
        avatar: "",
        telephone: "",
        localisation: "",
      });
      navigate("/login");
    } catch (error) {
      toast.error("Erreur : " + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row">
      <LeftPanel
        accountType={
          formData.accountType
        }
      />

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-8 lg:p-12 bg-background">
        <div className="w-full max-w-md">
          {/* Logo Mobile */}
          <Link
            to="/"
            className="inline-flex items-center gap-2 mb-8 lg:hidden"
          >
            <ChefHat className="w-8 h-8 text-primary" />
            <span className="text-primary font-semibold text-2xl">
              Yakalma
            </span>
          </Link>

          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl sm:text-4xl mb-3">
              Créer un compte
            </h1>
            <p className="text-muted-foreground text-lg">
              Rejoignez-nous
              en quelques
              secondes
            </p>
          </div>

          <AccountTypeSelector
            accountType={
              formData.accountType
            }
            onChange={(
              type,
            ) =>
              setFormData(
                (prev) => ({
                  ...prev,
                  accountType:
                    type,
                }),
              )
            }
          />

          <form
            encType="multipart/form-data"
            onSubmit={
              handleSubmit
            }
            className="space-y-4"
          >
            <Input
              id="avatar"
              label="Photo de profil"
              type="file"
              onChange={(e) =>
                handleChange(
                  "avatar",
                  e.target
                    .files?.[0] ??
                    null,
                )
              }
              onBlur={() =>
                handleBlur(
                  "avatar",
                )
              }
              placeholder="Jean Dupont"
              touched={
                touched.avatar
              }
              error={
                errors.avatar
              }
              icon={
                <PictureInPicture className="w-5 h-5" />
              }
            />

            <Input
              id="name"
              label="Nom complet"
              type="text"
              value={
                formData.name
              }
              onChange={(e) =>
                handleChange(
                  "name",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "name",
                )
              }
              placeholder="Jean Dupont"
              touched={
                touched.name
              }
              error={
                errors.name
              }
              icon={
                <User className="w-5 h-5" />
              }
            />

            <Input
              id="email"
              label="Adresse email"
              type="email"
              value={
                formData.email
              }
              onChange={(e) =>
                handleChange(
                  "email",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "email",
                )
              }
              placeholder="votre@email.com"
              touched={
                touched.email
              }
              error={
                errors.email
              }
              icon={
                <Mail className="w-5 h-5" />
              }
            />

            <Input
              id="telephone"
              label="Numéro de téléphone"
              type="tel"
              value={
                formData.telephone
              }
              onChange={(e) =>
                handleChange(
                  "telephone",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "telephone",
                )
              }
              placeholder="77 123 45 67"
              touched={
                touched.telephone
              }
              error={
                errors.telephone
              }
              icon={
                <Phone className="w-5 h-5" />
              }
            />

            <Input
              id="localisation"
              label="Localisation"
              type="text"
              value={
                formData.localisation
              }
              onChange={(e) =>
                handleChange(
                  "localisation",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "localisation",
                )
              }
              placeholder="Dakar, Medina"
              touched={
                touched.localisation
              }
              error={
                errors.localisation
              }
              icon={
                <MapPin className="w-5 h-5" />
              }
            />

            <Input
              id="password"
              label="Mot de passe"
              type="password"
              value={
                formData.password
              }
              onChange={(e) =>
                handleChange(
                  "password",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "password",
                )
              }
              touched={
                touched.password
              }
              error={
                errors.password
              }
              icon={
                <Lock className="w-5 h-5" />
              }
              showStrength
            />

            <Input
              id="confirmPassword"
              label="Confirmer le mot de passe"
              type="password"
              value={
                formData.confirmPassword
              }
              onChange={(e) =>
                handleChange(
                  "confirmPassword",
                  e.target
                    .value,
                )
              }
              onBlur={() =>
                handleBlur(
                  "confirmPassword",
                )
              }
              touched={
                touched.confirmPassword
              }
              error={
                errors.confirmPassword
              }
              icon={
                <Lock className="w-5 h-5" />
              }
            />

            <TermsCheckbox
              checked={
                formData.acceptTerms
              }
              onChange={(
                e,
              ) => {
                setFormData(
                  (prev) => ({
                    ...prev,
                    acceptTerms:
                      e.target
                        .checked,
                  }),
                );
                setErrors(
                  (prev) => ({
                    ...prev,
                    acceptTerms:
                      "",
                  }),
                );
              }}
              error={
                errors.acceptTerms
              }
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full mt-6"
              isLoading={
                isLoading
              }
            >
              <span>
                Créer mon
                compte
              </span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-muted-foreground">
              Vous avez déjà
              un compte ?{" "}
              <Link
                to="/login"
                className="text-primary font-semibold hover:underline"
              >
                Connectez-vous
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
