import { BookOpen, FileText } from "lucide-react";

import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoCta,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const sections = [
  {
    title: "1. Objet",
    description:
      "Yakalma met en relation des clients recherchant des plats faits maison avec des chefs indépendants qui proposent leurs créations culinaires.",
  },
  {
    title: "2. Compte utilisateur",
    description:
      "Chaque utilisateur est responsable de l'exactitude de ses informations, de la confidentialité de son compte et de l'utilisation faite depuis son espace.",
  },
  {
    title: "3. Commandes",
    description:
      "Les commandes sont passées depuis le catalogue. Leur préparation, disponibilité et suivi dépendent des informations communiquées au moment de l'achat.",
  },
  {
    title: "4. Paiements",
    description:
      "Les paiements sont traités via des moyens sécurisés afin de protéger les clients, les chefs et la bonne exécution des commandes.",
  },
  {
    title: "5. Responsabilités",
    description:
      "Les vendeurs s'engagent à proposer des plats conformes à leurs annonces. Les clients s'engagent à fournir des informations fiables pour la commande.",
  },
  {
    title: "6. Respect de la communauté",
    description:
      "Chaque membre doit adopter un comportement respectueux, honnête et compatible avec une expérience locale de confiance.",
  },
  {
    title: "7. Modification des CGU",
    description:
      "Yakalma peut mettre à jour ses conditions afin de tenir compte de l'évolution du service, des usages ou des obligations applicables.",
  },
];

export default function Terms() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={BookOpen}>
        Dernière mise à jour : Juin 2026.
      </InfoBanner>
      <InfoHero
        eyebrow="Cadre d'utilisation"
        title="Conditions Générales d'Utilisation"
        description="Un résumé clair des règles essentielles pour utiliser Yakalma dans un cadre fiable, respectueux et transparent."
      />

      <InfoSection>
        <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-white border border-border-warm px-4 py-2 text-sm font-semibold text-primary">
          <FileText className="w-4 h-4" aria-hidden="true" />
          Dernière mise à jour : Juin 2026
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <Card key={section.title} className="p-6 rounded-2xl hover:-translate-y-1 duration-200">
              <h2 className="text-xl font-semibold mb-3">{section.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{section.description}</p>
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoCta
        icon={BookOpen}
        title="Une question sur les conditions ?"
        description="Contactez-nous pour toute demande liée à l'utilisation de la plateforme."
        buttonLabel="Nous contacter"
        to="/contact"
      />
    </div>
  );
}

