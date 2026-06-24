import Input from "../ui/Input";
import Button from "../ui/Button";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { supabase } from "../../services/supabase";
import { useState } from "react";

export function ProfileForm() {
  const { user, profile } = useAuth();
  const [formData, setFormData] = useState({
    nom_complet: profile.nom_complet,
    telephone: profile.telephone,
    localisation: profile.localisation,
    email: user.email,
  });

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    // Handle profile update logic here
    try {
      const profileChanged =
        formData.nom_complet !== profile.nom_complet ||
        formData.telephone !== profile.telephone ||
        formData.localisation !== profile.localisation;

      const emailChanged =
        formData.email !== user.email;

      if (!profileChanged && !emailChanged) {
        toast.info("Aucune modification détectée.");
        return;
      }

      // Mise à jour du profil
      if (profileChanged) {
        const { error: profileError } = await supabase
          .from("profiles")
          .update({
            nom_complet: formData.nom_complet,
            telephone: formData.telephone,
            localisation: formData.localisation,
          })
          .eq("user_id", user.id);

        if (profileError) throw profileError;
      }

      // Mise à jour de l'email
      if (emailChanged) {
        const { error: emailError } =
          await supabase.auth.updateUser({
            email: formData.email,
            options: {
              emailRedirectTo:
                "http://localhost:5173/seller/dashboard",
            }
          });

        if (emailError) throw emailError;

        toast.info(
          "Consultez votre mail et cliquez sur le lien de confirmation !"
        );
      }

      if (profileChanged && !emailChanged) {
        toast.success("Profil mis à jour avec succès !");
      }

      if (!profileChanged && emailChanged) {
        toast.success("Demande de changement d'email envoyée !");
      }

      if (profileChanged && emailChanged) {
        toast.success(
          "Profil mis à jour et demande de changement d'email envoyée !"
        );
      }
    } catch (error) {
      toast.error("Erreur lors de la mise à jour du profil: " + error.message);
    }
  };
  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Informations personnelles</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gardez vos informations à jour pour faciliter vos commandes.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleUpdateProfile}>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="name"
            label="Nom complet"
            value={formData.nom_complet}
            onChange={(e) => setFormData({ ...formData, nom_complet: e.target.value })}
          />
          <Input
            id="email"
            label="Email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="phone"
            label="Téléphone"
            type="tel"
            value={formData.telephone}
            onChange={(e) => setFormData({ ...formData, telephone: e.target.value })}
          />
          <Input
            id="address"
            label="Adresse principale"
            value={formData.localisation}
            onChange={(e) => setFormData({ ...formData, localisation: e.target.value })}
          />
        </div>


        <Button
          type="submit"
          variant="primary"
          className="px-6 py-3"
        >
          Enregistrer les modifications
        </Button>
      </form>
    </section>
  );
}
