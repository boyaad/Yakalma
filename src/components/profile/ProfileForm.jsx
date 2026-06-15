import Input from "../ui/Input";
import Button from "../ui/Button";

export function ProfileForm({ user }) {
  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-8">
        <h2 className="text-2xl font-semibold">Informations personnelles</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Gardez vos informations à jour pour faciliter vos commandes.
        </p>
      </div>

      <form className="space-y-5">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input id="name" label="Nom complet" value={user.name} />
          <Input
            id="email"
            label="Email"
            type="email"
            value={user.email}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <Input
            id="phone"
            label="Téléphone"
            type="tel"
            value={user.phone}
          />
          <Input
            id="memberSince"
            label="Client depuis"
            value={user.memberSince}
          />
        </div>

        <Input id="address" label="Adresse principale" value={user.address} />

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
