import { ChevronDown, HelpCircle, Mail, Search } from "lucide-react";

import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoCta,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const faqGroups = [
  {
    title: "Commande",
    items: [
      {
        question: "Comment commander ?",
        answer:
          "Parcourez le catalogue, ouvrez la fiche d'un plat, choisissez la quantité puis validez votre panier.",
      },
      {
        question: "Puis-je annuler ?",
        answer:
          "Une commande peut être annulée tant qu'elle n'a pas encore été acceptée ou préparée par le chef.",
      },
    ],
  },
  {
    title: "Livraison",
    items: [
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Le statut de votre commande est disponible depuis votre profil et se met à jour à chaque étape.",
      },
    ],
  },
  {
    title: "Paiement",
    items: [
      {
        question: "Quels moyens de paiement sont acceptés ?",
        answer:
          "Yakalma privilégie les moyens de paiement sécurisés disponibles au moment de la commande.",
      },
    ],
  },
  {
    title: "Compte",
    items: [
      {
        question: "Modifier mon profil",
        answer:
          "Accédez à votre profil pour mettre à jour vos informations personnelles, coordonnées et préférences.",
      },
      {
        question: "Réinitialiser mon mot de passe",
        answer:
          "Depuis l'écran de connexion, utilisez l'option de réinitialisation pour recevoir les instructions par email.",
      },
    ],
  },
  {
    title: "Chef",
    items: [
      {
        question: "Comment publier un plat ?",
        answer:
          "Après la création de votre profil chef, ajoutez un plat depuis votre tableau de bord vendeur.",
      },
      {
        question: "Comment recevoir mes paiements ?",
        answer:
          "Les informations de paiement sont suivies depuis votre espace chef selon les commandes validées.",
      },
    ],
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={HelpCircle}>
        Nous répondons généralement sous 24h.
      </InfoBanner>
      <InfoHero
        eyebrow="Support"
        title="Centre d'aide"
        description="Retrouvez les réponses essentielles pour commander, gérer votre compte ou publier vos plats en tant que chef."
      />

      <InfoSection title="Questions fréquentes">
        {/* <div className="relative max-w-3xl mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" aria-hidden="true" />
          <input
            type="search"
            placeholder="Rechercher une question"
            className="w-full h-14 rounded-2xl border border-border-warm bg-white pl-12 pr-4 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            aria-label="Rechercher dans le centre d'aide"
          />
        </div> */}

        <div className="grid gap-6 lg:grid-cols-2">
          {faqGroups.map((group) => (
            <Card key={group.title} className="p-6 rounded-2xl">
              <h2 className="text-2xl font-semibold mb-5">{group.title}</h2>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <details
                    key={item.question}
                    className="group rounded-xl border border-border-warm bg-background-warm px-4 py-3 open:bg-white transition-colors"
                  >
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-semibold text-foreground">
                      {item.question}
                      <ChevronDown className="w-5 h-5 text-primary transition-transform duration-200 group-open:rotate-180" aria-hidden="true" />
                    </summary>
                    <p className="pt-3 text-sm leading-relaxed text-muted-foreground">
                      {item.answer}
                    </p>
                  </details>
                ))}
              </div>
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoCta
        icon={Mail}
        title="Besoin d'une réponse personnalisée ?"
        description="Notre équipe peut vous aider à clarifier une commande, un compte ou une demande chef."
        buttonLabel="Nous contacter"
        to="/contact"
      />
    </div>
  );
}

