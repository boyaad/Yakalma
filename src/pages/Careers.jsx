import { BriefcaseBusiness, Globe2, Rocket, Send, UsersRound } from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const reasons = [
  {
    title: "Projet ambitieux",
    description:
      "Participer à une marketplace pensée pour devenir une référence de la cuisine maison locale.",
    icon: Rocket,
  },
  {
    title: "Impact local",
    description:
      "Aider des chefs indépendants à gagner en visibilité et à développer leur activité.",
    icon: Globe2,
  },
  {
    title: "Équipe passionnée",
    description:
      "Construire un produit utile avec des personnes attentives à l'expérience et au détail.",
    icon: UsersRound,
  },
];

export default function Careers() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={Rocket}>
        Construisons ensemble la cuisine locale.
      </InfoBanner>
      <InfoHero
        eyebrow="Carrières"
        title="Rejoignez Yakalma"
        description="Nous construisons une expérience simple, chaleureuse et fiable pour rapprocher les talents culinaires sénégalais de leurs clients."
      />

      <InfoSection title="Pourquoi nous rejoindre ?">
        <div className="grid gap-6 md:grid-cols-3">
          {reasons.map(({ title, description, icon: Icon }) => (
            <Card key={title} className="p-6 rounded-2xl hover:-translate-y-1 duration-200">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h3 className="text-xl font-semibold mb-3">{title}</h3>
              <p className="text-muted-foreground leading-relaxed">{description}</p>
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoSection className="bg-white">
        <Card className="p-8 sm:p-10 rounded-2xl text-center max-w-4xl mx-auto">
          <BriefcaseBusiness className="w-12 h-12 text-primary mx-auto mb-5" aria-hidden="true" />
          <h2 className="text-3xl mb-4">Aucune offre disponible actuellement.</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Nous restons toujours curieux de rencontrer des profils engagés,
            autonomes et sensibles aux produits qui ont un impact local.
          </p>
          <Button href="mailto:contact@yakalma.sn?subject=Candidature%20spontan%C3%A9e%20Yakalma">
            <Send className="w-5 h-5" aria-hidden="true" />
            Envoyer mon CV
          </Button>
        </Card>
      </InfoSection>
    </div>
  );
}

