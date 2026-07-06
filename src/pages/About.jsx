import { ChefHat, Heart, ShieldCheck, Sparkles, UsersRound } from "lucide-react";

import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoCta,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const values = [
  {
    title: "Authenticité",
    description:
      "Des plats maison préparés par des cuisiniers qui connaissent leurs recettes, leurs gestes et leurs produits.",
    icon: ChefHat,
  },
  {
    title: "Confiance",
    description:
      "Des profils clairs, des avis utiles et une expérience pensée pour commander sereinement.",
    icon: ShieldCheck,
  },
  {
    title: "Partage",
    description:
      "Une communauté locale où chaque repas devient une manière simple de transmettre et de se retrouver.",
    icon: Heart,
  },
];

export default function About() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={ChefHat}>
        Plus de 250 plats partagés par notre communauté.
      </InfoBanner>
      <InfoHero
        eyebrow="À propos"
        title="Qui sommes-nous ?"
        description="Yakalma est une marketplace qui met en relation des passionnés de cuisine avec des personnes recherchant des plats faits maison, authentiques et préparés avec soin."
      />

      <InfoSection title="Nos valeurs">
        <div className="grid gap-6 md:grid-cols-3">
          {values.map(({ title, description, icon: Icon }) => (
            <Card
              key={title}
              className="p-6 rounded-2xl hover:-translate-y-1 duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoSection className="bg-white" eyebrow="Notre mission" title="Rendre la cuisine locale plus accessible">
        <Card className="p-8 sm:p-10 rounded-2xl max-w-5xl">
          <div className="flex flex-col md:flex-row gap-6 md:items-start">
            <div className="w-14 h-14 rounded-2xl bg-primary text-white flex items-center justify-center shrink-0">
              <Sparkles className="w-7 h-7" aria-hidden="true" />
            </div>
            <div>
              <h3 className="text-2xl font-semibold mb-4">
                Créer un pont entre les cuisines familiales et les tables du quotidien.
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                Notre vision est de valoriser les talents culinaires locaux, de simplifier
                l'accès aux plats faits maison et d'offrir aux chefs une vitrine fiable
                pour développer leur activité.
              </p>
            </div>
          </div>
        </Card>
      </InfoSection>

      <InfoCta
        icon={UsersRound}
        title="Envie de goûter à la communauté Yakalma ?"
        description="Parcourez les plats disponibles et trouvez votre prochain repas fait maison."
        buttonLabel="Découvrir le catalogue"
        to="/plats"
      />
    </div>
  );
}

