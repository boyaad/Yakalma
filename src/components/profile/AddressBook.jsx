import { useState } from "react";
import { MapPin, Plus, X, Pencil, Trash2, Star } from "lucide-react";
import Button from "../ui/Button";
import Modal from "../ui/Modal";
import { useUserInfo } from "../../context/UserInfoContext";
import { toast } from "react-toastify";

/* ─── Modal Ajouter / Modifier ─────────────────────────────── */
function AddressModal({ initial, onClose, onSave, isSaving }) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [localisation, setLocalisation] = useState(initial?.localisation ?? "");
  const [isDefault, setIsDefault] = useState(initial?.isDefault ?? false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!label.trim()) e.label = "Le nom de l'adresse est requis (ex : Maison)";
    if (!localisation.trim()) e.localisation = "L'adresse complète est requise";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = (ev) => {
    ev.preventDefault();
    if (!validate()) return;
    onSave({ label: label.trim(), localisation: localisation.trim(), isDefault });
  };

  return (
    <Modal
      isOpen={true}
      onClose={onClose}
      title={initial ? "Modifier l'adresse" : "Nouvelle adresse"}
      size="md"
    >
      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Label */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Nom de l&apos;adresse
          </label>
          <input
            type="text"
            placeholder="ex : Maison, Bureau, Chez maman…"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
              errors.label ? "border-error" : "border-border-warm"
            }`}
          />
          {errors.label && (
            <p className="mt-1 text-xs text-error">{errors.label}</p>
          )}
        </div>

        {/* Localisation */}
        <div>
          <label className="block text-sm font-medium text-foreground mb-1">
            Adresse complète
          </label>
          <input
            type="text"
            placeholder="ex : 123 Rue Principale, Dakar"
            value={localisation}
            onChange={(e) => setLocalisation(e.target.value)}
            className={`w-full rounded-xl border px-4 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/40 transition ${
              errors.localisation ? "border-error" : "border-border-warm"
            }`}
          />
          {errors.localisation && (
            <p className="mt-1 text-xs text-error">{errors.localisation}</p>
          )}
        </div>

        {/* isDefault toggle */}
        <label className="flex items-center gap-3 cursor-pointer select-none">
          <div
            role="switch"
            aria-checked={isDefault}
            onClick={() => setIsDefault((v) => !v)}
            className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${
              isDefault ? "bg-primary" : "bg-muted-foreground/30"
            }`}
          >
            <span
              className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                isDefault ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </div>
          <span className="text-sm text-foreground">Adresse par défaut</span>
        </label>

        {/* Actions */}
        <div className="flex flex-col-reverse gap-3 pt-2 sm:flex-row sm:justify-end">
          <Button type="button" variant="ghost" onClick={onClose} className="px-5">
            Annuler
          </Button>
          <Button
            type="submit"
            variant="primary"
            className="px-5"
            disabled={isSaving}
          >
            {isSaving ? "Enregistrement…" : initial ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </form>
    </Modal>
  );
}

/* ─── Composant principal ───────────────────────────────────── */
export function AddressBook() {
  const { addresses, addressesLoading, addAddress, updateAddress, deleteAddress } =
    useUserInfo();

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  if (addressesLoading) {
    return (
      <div className="text-center text-muted-foreground py-12">
        Chargement des adresses…
      </div>
    );
  }

  /* ── Sauvegarder (ajout ou modif) ── */
  const handleSave = async (data) => {
    setIsSaving(true);
    try {
      if (editing) {
        await updateAddress(editing.id, data);
        toast.success("Adresse modifiée avec succès !");
      } else {
        await addAddress(data);
        toast.success("Adresse ajoutée avec succès !");
      }
      setModalOpen(false);
      setEditing(null);
    } catch (err) {
      toast.error("Erreur : " + (err?.message ?? "impossible de sauvegarder l'adresse"));
    } finally {
      setIsSaving(false);
    }
  };

  /* ── Supprimer ── */
  const handleDelete = async (id) => {
    setDeletingId(id);
    try {
      await deleteAddress(id);
      toast.success("Adresse supprimée.");
    } catch (err) {
      toast.error("Erreur lors de la suppression : " + (err?.message ?? ""));
    } finally {
      setDeletingId(null);
    }
  };

  const openEdit = (addr) => { setEditing(addr); setModalOpen(true); };
  const openAdd  = ()     => { setEditing(null);  setModalOpen(true); };

  return (
    <>
      <section className="rounded-2xl border border-border-warm bg-white p-4 sm:p-8">
        {/* En-tête */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-2xl font-semibold">Mes adresses</h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Gérez les lieux utilisés pour vos livraisons.
            </p>
          </div>
          <Button
            type="button"
            variant="primary"
            className="h-11 w-full px-5 sm:w-auto"
            onClick={openAdd}
          >
            <Plus className="h-4 w-4 mr-2" />
            Ajouter
          </Button>
        </div>

        {/* Liste */}
        <div className="grid gap-4 md:grid-cols-2">
          {!addresses || addresses.length === 0 ? (
            <div className="col-span-full flex flex-col items-center gap-3 py-12 text-center text-muted-foreground">
              <MapPin className="h-10 w-10 opacity-30" />
              <p>Aucune adresse enregistrée.</p>
              <button
                type="button"
                onClick={openAdd}
                className="text-primary font-semibold hover:underline text-sm font-poppins"
              >
                + Ajouter une adresse
              </button>
            </div>
          ) : (
            addresses.map((item) => (
              <article
                key={item.id}
                className="min-w-0 rounded-xl border border-border-warm bg-background-warm p-4 flex flex-col gap-3 sm:p-5"
              >
                {/* Titre + badge */}
                <div className="flex items-start gap-3">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                    <MapPin className="h-5 w-5 text-primary" />
                  </span>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-semibold text-foreground leading-tight font-poppins">
                        {item.label}
                      </h3>
                      {item.isDefault && (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-primary bg-primary/10 px-2 py-0.5 rounded-full font-poppins">
                          <Star className="h-3 w-3" />
                          Par défaut
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-5 font-poppins">
                      {item.localisation}
                    </p>
                  </div>
                </div>

                {/* Boutons */}
                <div className="mt-auto flex flex-col gap-2 min-[420px]:flex-row">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border-warm bg-white px-3 py-1.5 text-sm font-medium text-foreground hover:bg-primary hover:text-white hover:border-primary transition-colors cursor-pointer font-poppins"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                    Modifier
                  </button>
                  <button
                    type="button"
                    onClick={() => setDeleteConfirmId(item.id)}
                    disabled={deletingId === item.id}
                    className="flex items-center justify-center gap-1.5 rounded-lg border border-border-warm bg-white px-3 py-1.5 text-sm font-medium text-muted-foreground hover:bg-error hover:text-white hover:border-error transition-colors disabled:opacity-50 cursor-pointer font-poppins"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    {deletingId === item.id ? "Suppression…" : "Supprimer"}
                  </button>
                </div>
              </article>
            ))
          )}
        </div>
      </section>

      {/* Modal */}
      {modalOpen && (
        <AddressModal
          initial={editing}
          onClose={() => { setModalOpen(false); setEditing(null); }}
          onSave={handleSave}
          isSaving={isSaving}
        />
      )}

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={deleteConfirmId !== null}
        onClose={() => setDeleteConfirmId(null)}
        title="Supprimer l'adresse"
        size="sm"
      >
        <p className="mb-6 text-foreground/70 font-poppins">
          Êtes-vous sûr de vouloir supprimer cette adresse de votre carnet d'adresses ?
        </p>
        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setDeleteConfirmId(null)}
          >
            Annuler
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => {
              const id = deleteConfirmId;
              setDeleteConfirmId(null);
              handleDelete(id);
            }}
          >
            Supprimer
          </Button>
        </div>
      </Modal>
    </>
  );
}
