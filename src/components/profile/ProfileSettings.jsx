const notificationOptions = [
  {
    id: "offers",
    label: "Recevoir les offres promotionnelles",
    defaultChecked: true,
  },
  {
    id: "orders",
    label: "Notifications de nouvelles commandes",
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
    <section className="bg-white rounded-2xl p-6 sm:p-8 border border-border-warm">
      <h2 className="text-2xl font-semibold mb-8">Paramètres</h2>

      <div className="space-y-8">
        <div>
          <h3 className="mb-4">Notifications</h3>
          <div className="space-y-3">
            {notificationOptions.map((option) => (
              <label
                key={option.id}
                htmlFor={option.id}
                className="flex items-center justify-between gap-4 cursor-pointer"
              >
                <span>{option.label}</span>
                <input
                  id={option.id}
                  type="checkbox"
                  defaultChecked={option.defaultChecked}
                  className="w-4 h-4 rounded text-primary focus:ring-ring"
                />
              </label>
            ))}
          </div>
        </div>

        <div>
          <h3 className="mb-4">Sécurité</h3>
          <button
            type="button"
            className="px-4 py-2 bg-muted rounded-lg hover:bg-muted/80 transition-colors"
          >
            Changer le mot de passe
          </button>
        </div>
      </div>
    </section>
  );
}
