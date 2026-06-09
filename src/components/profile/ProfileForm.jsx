function ProfileInput({ id, label, type = "text", value }) {
  return (
    <div>
      <label htmlFor={id} className="block mb-2 font-medium">
        {label}
      </label>
      <input
        id={id}
        type={type}
        defaultValue={value}
        className="w-full px-8 py-4 bg-white border border-border-warm rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/30"
      />
    </div>
  );
}

export function ProfileForm({ user }) {
  return (
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border-warm">
      <h2 className="text-xl font-semibold mb-8">Informations personnelles</h2>

      <form className="space-y-5">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <ProfileInput id="name" label="Nom complet" value={user.name} />
          <ProfileInput
            id="email"
            label="Email"
            type="email"
            value={user.email}
          />
        </div>

        <ProfileInput
          id="phone"
          label="Téléphone"
          type="tel"
          value={user.phone}
        />

        <ProfileInput id="address" label="Adresse" value={user.address} />

        <button
          type="submit"
          className="px-6 py-3 bg-primary text-white rounded-xl font-semibold hover:bg-accent transition-colors"
        >
          Enregistrer les modifications
        </button>
      </form>
    </section>
  );
}
