import { MapPin, Plus } from "lucide-react";

export function AddressBook({ addresses }) {
  return (
    <section className="rounded-2xl border border-border-warm bg-white p-6 sm:p-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Mes adresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Gérez les lieux utilisés pour vos livraisons.
          </p>
        </div>
        <button
          type="button"
          className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-primary px-5 font-semibold text-white transition-colors hover:bg-accent"
        >
          <Plus className="h-4 w-4" />
          Ajouter
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addresses.map((item) => (
          <article
            key={item.id}
            className="rounded-xl border border-border-warm bg-background-warm p-5"
          >
            <div className="mb-4 flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
                  <MapPin className="h-5 w-5 text-primary" />
                </span>
                <div>
                  <h3 className="font-semibold text-foreground">
                    {item.label}
                  </h3>
                  {item.isDefault && (
                    <p className="text-xs font-semibold text-primary">
                      Adresse par défaut
                    </p>
                  )}
                </div>
              </div>
            </div>

            <p className="text-sm leading-6 text-muted-foreground">
              {item.address}
            </p>

            <div className="mt-5 flex gap-3">
              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-primary hover:text-white"
              >
                Modifier
              </button>
              <button
                type="button"
                className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-muted-foreground transition-colors hover:text-primary"
              >
                Supprimer
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
