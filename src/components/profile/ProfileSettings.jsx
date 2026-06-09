const notificationOptions = [
  {
    id: "offers",
    label: "Recevoir les offres promotionnelles",
    defaultChecked: true,
  },
  {
    id: "orders",
    label: "Notifications de suivi de commande",
    defaultChecked: true,
  },
  {
    id: "newsletter",
    label: "Newsletter hebdomadaire",
    defaultChecked: false,
  },
];

export function ProfileSettings() {
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
          <h3 className="mb-4 font-semibold">Notifications</h3>
          <div className="space-y-3">
            {notificationOptions.map((option) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="flex cursor-pointer items-center justify-between gap-4 rounded-xl bg-background-warm px-4 py-3"
              >
                <span>{option.label}</span>
                <input
                  id={option.id}
                  type="checkbox"
                  defaultChecked={option.defaultChecked}
                  className="h-4 w-4 rounded text-primary focus:ring-primary"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4 font-semibold">Sécurité</h3>
          <button
            type="button"
            className="rounded-lg bg-background-warm px-4 py-2 font-medium transition-colors hover:bg-primary hover:text-white"
          >
            Changer le mot de passe
          </button>
        </div>
      </div>
    </section>
  );
}
