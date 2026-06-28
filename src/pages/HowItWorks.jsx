import { ArrowDown, ChefHat, ClipboardList, CreditCard, Search, Store, Utensils } from "lucide-react";

import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoCta,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const customerSteps = [
  { title: "Explorer le catalogue", icon: Search },
  { title: "Choisir un plat", icon: Utensils },
  { title: "Passer commande", icon: CreditCard },
  { title: "Déguster", icon: ChefHat },
];

const chefSteps = [
  { title: "Créer son profil", icon: Store },
  { title: "Publier ses plats", icon: ClipboardList },
  { title: "Recevoir des commandes", icon: CreditCard },
  { title: "Générer des revenus", icon: ChefHat },
];

function Timeline({ steps }) {
  return (
    <div className="grid gap-4">
      {steps.map(({ title, icon: Icon }, index) => (
        <div key={title}>
          <Card className="p-5 rounded-2xl hover:-translate-y-1 duration-200">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Étape {index + 1}</p>
                <h3 className="text-xl font-semibold">{title}</h3>
              </div>
            </div>
          </Card>
          {index < steps.length - 1 && (
            <div className="h-8 flex items-center justify-center text-primary">
              <ArrowDown className="w-5 h-5" aria-hidden="true" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default function HowItWorks() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={ChefHat}>
        Commander un plat en moins de 2 minutes.
      </InfoBanner>
      <InfoHero
        eyebrow="Fonctionnement"
        title="Comment ça marche ?"
        description="Yakalma simplifie la rencontre entre ceux qui aiment cuisiner et ceux qui cherchent un vrai plat maison, sans parcours compliqué."
      />

      <InfoSection title="Deux parcours, une même expérience simple">
        <div className="grid gap-8 lg:grid-cols-2">
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                Pour les clients
              </p>
              <h2 className="text-3xl">Du catalogue à l'assiette</h2>
            </div>
            <Timeline steps={customerSteps} />
          </div>
          <div>
            <div className="mb-6">
              <p className="text-sm font-semibold uppercase tracking-wide text-primary mb-2">
                Pour les chefs
              </p>
              <h2 className="text-3xl">De la cuisine aux revenus</h2>
            </div>
            <Timeline steps={chefSteps} />
          </div>
        </div>
      </InfoSection>

      <InfoCta
        icon={ChefHat}
        title="Vous cuisinez avec passion ?"
        description="Créez votre profil et commencez à présenter vos plats à la communauté."
        buttonLabel="Devenir chef"
        to="/register?role=chef"
      />
    </div>
  );
}

