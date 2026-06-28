import { useCallback, useEffect, useState } from "react";
import { Lock } from "lucide-react";
import { toast } from "react-toastify";

import { useAuth } from "../../context/AuthContext";
import { changePassword } from "../../services/authService";
import {
  defaultPreferences,
  getUserPreferences,
  saveUserPreferences,
} from "../../services/userPreferenceService";
import Button from "../ui/Button";
import Input from "../ui/Input";
import Modal from "../ui/Modal";

const notificationOptions = [
  {
    id: "promotionalOffers",
    label: "Recevoir les offres promotionnelles",
  },
  {
    id: "orderTrackingNotifications",
    label: "Notifications de suivi de commande",
  },
  {
    id: "weeklyNewsletter",
    label: "Newsletter hebdomadaire",
  },
];

const initialPasswordForm = {
  currentPassword: "",
  newPassword: "",
  confirmPassword: "",
};

function validatePasswordForm(formData) {
  const errors = {};

  if (!formData.currentPassword) {
    errors.currentPassword = "Le mot de passe actuel est requis";
  }

  if (!formData.newPassword) {
    errors.newPassword = "Le nouveau mot de passe est requis";
  } else if (formData.newPassword.length < 8) {
    errors.newPassword = "Au moins 8 caractères requis";
  }

  if (!formData.confirmPassword) {
    errors.confirmPassword = "Confirmez votre nouveau mot de passe";
  } else if (formData.confirmPassword !== formData.newPassword) {
    errors.confirmPassword = "Les mots de passe ne correspondent pas";
  }

  return errors;
}

export function ProfileSettings() {
  const { user } = useAuth();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [preferencesLoading, setPreferencesLoading] = useState(true);
  const [savingPreferenceId, setSavingPreferenceId] = useState("");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState(initialPasswordForm);
  const [passwordErrors, setPasswordErrors] = useState({});
  const [passwordTouched, setPasswordTouched] = useState({});
  const [isPasswordLoading, setIsPasswordLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function loadPreferences() {
      if (!user) return;

      try {
        setPreferencesLoading(true);
        const data = await getUserPreferences(user.id);

        if (isMounted) {
          setPreferences(data);
        }
      } catch (error) {
        toast.error(
          error.message || "Impossible de charger vos préférences.",
        );
      } finally {
        if (isMounted) {
          setPreferencesLoading(false);
        }
      }
    }

    loadPreferences();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const handlePreferenceChange = async (preferenceId) => {
    if (!user || savingPreferenceId) return;

    const nextPreferences = {
      ...preferences,
      [preferenceId]: !preferences[preferenceId],
    };

    setPreferences(nextPreferences);
    setSavingPreferenceId(preferenceId);

    try {
      const savedPreferences = await saveUserPreferences(user.id, nextPreferences);
      setPreferences(savedPreferences);
      toast.success("✓ Préférences enregistrées.");
    } catch (error) {
      setPreferences(preferences);
      toast.error(
        error.message || "Impossible d'enregistrer vos préférences.",
      );
    } finally {
      setSavingPreferenceId("");
    }
  };

  const resetPasswordModal = useCallback(() => {
    setPasswordForm(initialPasswordForm);
    setPasswordErrors({});
    setPasswordTouched({});
    setIsPasswordLoading(false);
  }, []);

  const closePasswordModal = useCallback(() => {
    if (isPasswordLoading) return;

    setIsPasswordModalOpen(false);
    resetPasswordModal();
  }, [isPasswordLoading, resetPasswordModal]);

  const handlePasswordChange = (field, value) => {
    const nextForm = {
      ...passwordForm,
      [field]: value,
    };

    setPasswordForm(nextForm);

    if (passwordTouched[field]) {
      setPasswordErrors(validatePasswordForm(nextForm));
    }
  };

  const handlePasswordBlur = (field) => {
    setPasswordTouched((prev) => ({
      ...prev,
      [field]: true,
    }));
    setPasswordErrors(validatePasswordForm(passwordForm));
  };

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();

    const errors = validatePasswordForm(passwordForm);

    if (Object.keys(errors).length > 0) {
      setPasswordTouched({
        currentPassword: true,
        newPassword: true,
        confirmPassword: true,
      });
      setPasswordErrors(errors);
      return;
    }

    setIsPasswordLoading(true);
    setPasswordErrors({});

    const { error } = await changePassword(
      user.email,
      passwordForm.currentPassword,
      passwordForm.newPassword,
    );

    if (error) {
      setPasswordErrors({
        form: error.message || "Impossible de changer le mot de passe.",
      });
      setIsPasswordLoading(false);
      return;
    }

    toast.success("Mot de passe modifié avec succès.");
    setIsPasswordModalOpen(false);
    resetPasswordModal();
  };

  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Paramètres</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Ajustez vos préférences de compte et de notifications.
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <div className="mb-4 flex items-center justify-between gap-4">
            <h3 className="font-semibold">Notifications</h3>
            {preferencesLoading && (
              <span className="text-xs font-medium text-muted-foreground">
                Chargement...
              </span>
            )}
          </div>

          <div className="space-y-3">
            {notificationOptions.map((option) => {
              const isSaving = savingPreferenceId === option.id;

              return (
                <label
                  key={option.id}
                  htmlFor={option.id}
                  className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-background-warm px-4 py-3 transition-all hover:border-primary/30"
                >
                  <span>{option.label}</span>
                  <span className="flex items-center gap-3">
                    {isSaving && (
                      <span
                        className="h-4 w-4 rounded-full border-2 border-primary/20 border-t-primary animate-spin-custom"
                        aria-label="Sauvegarde en cours"
                      />
                    )}
                    <input
                      id={option.id}
                      type="checkbox"
                      checked={preferences[option.id]}
                      disabled={preferencesLoading || !!savingPreferenceId}
                      onChange={() => handlePreferenceChange(option.id)}
                      className="h-4 w-4 rounded text-primary focus:ring-primary disabled:cursor-not-allowed disabled:opacity-60"
                    />
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Sécurité</h3>
          <Button
            type="button"
            variant="ghost"
            className="bg-background-warm hover:bg-primary hover:text-white px-4 py-2 font-medium"
            onClick={() => setIsPasswordModalOpen(true)}
          >
            Changer le mot de passe
          </Button>
        </div>
      </div>

      <Modal
        isOpen={isPasswordModalOpen}
        onClose={closePasswordModal}
        title="Changer le mot de passe"
        size="md"
      >
        <form onSubmit={handlePasswordSubmit} className="space-y-4">
          <Input
            id="current-password"
            label="Mot de passe actuel"
            type="password"
            value={passwordForm.currentPassword}
            touched={passwordTouched.currentPassword}
            error={passwordErrors.currentPassword}
            disabled={isPasswordLoading}
            onChange={(event) =>
              handlePasswordChange("currentPassword", event.target.value)
            }
            onBlur={() => handlePasswordBlur("currentPassword")}
            icon={<Lock className="w-5 h-5" />}
          />

          <Input
            id="settings-new-password"
            label="Nouveau mot de passe"
            type="password"
            value={passwordForm.newPassword}
            touched={passwordTouched.newPassword}
            error={passwordErrors.newPassword}
            disabled={isPasswordLoading}
            onChange={(event) =>
              handlePasswordChange("newPassword", event.target.value)
            }
            onBlur={() => handlePasswordBlur("newPassword")}
            icon={<Lock className="w-5 h-5" />}
            showStrength
          />

          <Input
            id="settings-confirm-password"
            label="Confirmation"
            type="password"
            value={passwordForm.confirmPassword}
            touched={passwordTouched.confirmPassword}
            error={passwordErrors.confirmPassword}
            disabled={isPasswordLoading}
            onChange={(event) =>
              handlePasswordChange("confirmPassword", event.target.value)
            }
            onBlur={() => handlePasswordBlur("confirmPassword")}
            icon={<Lock className="w-5 h-5" />}
          />

          {passwordErrors.form && (
            <div
              className="rounded-xl border border-error/20 bg-error/5 px-4 py-3 text-sm font-medium text-error animate-fade-in"
              role="alert"
            >
              {passwordErrors.form}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="ghost"
              disabled={isPasswordLoading}
              onClick={closePasswordModal}
            >
              Annuler
            </Button>
            <Button type="submit" isLoading={isPasswordLoading}>
              Mettre à jour
            </Button>
          </div>
        </form>
      </Modal>
    </section>
  );
}
