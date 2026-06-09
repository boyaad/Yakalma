function ProfileInput({ id, label, type = "text", value }) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={value}
        className="w-full rounded-xl border border-border-warm bg-white px-4 py-3 text-foreground outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
      />
    </div>
  );
}

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
          <ProfileInput id="name" label="Nom complet" value={user.name} />
          <ProfileInput
            id="email"
            label="Email"
            type="email"
            value={user.email}
          />
        </div>

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <ProfileInput
            id="phone"
            label="Téléphone"
            type="tel"
            value={user.phone}
          />
          <ProfileInput
            id="memberSince"
            label="Client depuis"
            value={user.memberSince}
          />
        </div>

        <ProfileInput id="address" label="Adresse principale" value={user.address} />

        <button
          type="submit"
          className="rounded-xl bg-primary px-6 py-3 font-semibold text-white transition-colors hover:bg-accent"
        >
          Enregistrer les modifications
        </button>
      </form>
    </section>
  );
}
