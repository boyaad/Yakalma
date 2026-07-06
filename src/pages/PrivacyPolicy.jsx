import {
  Cookie,
  Database,
  Handshake,
  LockKeyhole,
  Mail,
  ShieldCheck,
  UserCheck,
} from "lucide-react";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const privacySections = [
  {
    title: "1. Données collectées",
    icon: Database,
    description: "Nous collectons uniquement les informations utiles au bon fonctionnement de Yakalma.",
    items: [
      "Nom et prénom",
      "Adresse e-mail",
      "Numéro de téléphone",
      "Adresse de livraison",
      "Informations relatives aux commandes",
      "Données de navigation nécessaires au bon fonctionnement de la plateforme",
    ],
  },
  {
    title: "2. Utilisation des données",
    icon: UserCheck,
    description: "Vos informations nous permettent de vous offrir une expérience fluide, fiable et sécurisée.",
    items: [
      "Créer votre compte",
      "Traiter vos commandes",
      "Faciliter les livraisons",
      "Améliorer nos services",
      "Assurer la sécurité de la plateforme",
      "Vous contacter si nécessaire",
    ],
  },
  {
    title: "3. Protection des données",
    icon: LockKeyhole,
    description:
      "Nous mettons en œuvre des mesures de sécurité raisonnables afin de protéger vos informations contre tout accès non autorisé, toute modification ou toute perte.",
  },
  {
    title: "4. Partage des informations",
    icon: Handshake,
    description:
      "Nous ne vendons jamais vos données personnelles. Certaines informations peuvent uniquement être partagées avec les prestataires nécessaires au fonctionnement du service, comme le paiement ou la livraison.",
  },
  {
    title: "5. Vos droits",
    icon: ShieldCheck,
    description: "Vous gardez la maîtrise de vos informations personnelles sur Yakalma.",
    items: [
      "Consulter vos informations",
      "Demander leur modification",
      "Demander leur suppression",
      "Nous contacter pour toute question concernant vos données",
    ],
  },
  {
    title: "6. Cookies",
    icon: Cookie,
    description:
      "Yakalma utilise des cookies uniquement pour améliorer votre expérience utilisateur et assurer le bon fonctionnement de la plateforme.",
  },
  {
    title: "7. Contact",
    icon: Mail,
    description: "Pour toute question concernant vos données personnelles, vous pouvez nous écrire à",
    contactEmail: "contact@yakalma.sn",
  },
];

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={ShieldCheck}>
        Vos données personnelles sont traitées avec attention et transparence.
      </InfoBanner>
      <InfoHero
        eyebrow="Confidentialité"
        title="Politique de confidentialité"
        description="Chez Yakalma, la protection de vos données personnelles est une priorité. Cette politique explique quelles informations nous collectons, pourquoi nous les utilisons et comment nous les protégeons."
        badge="Dernière mise à jour : Juin 2026"
      />

      <InfoSection>
        <div className="grid gap-5 md:grid-cols-2">
          {privacySections.map(({ title, icon: Icon, description, items, contactEmail }) => (
            <Card
              key={title}
              className="p-6 rounded-2xl hover:-translate-y-1 duration-200"
            >
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-5">
                <Icon className="w-6 h-6" aria-hidden="true" />
              </div>
              <h2 className="text-xl font-semibold mb-3">{title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {description}
                {contactEmail && (
                  <>
                    {" "}
                    <a
                      href={`mailto:${contactEmail}`}
                      className="font-semibold text-primary underline-offset-4 hover:underline"
                    >
                      {contactEmail}
                    </a>
                    .
                  </>
                )}
              </p>
              {items && (
                <ul className="mt-5 space-y-2 text-muted-foreground">
                  {items.map((item) => (
                    <li key={item} className="flex gap-3">
                      <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Card>
          ))}
        </div>
      </InfoSection>

      <InfoSection className="bg-white">
        <Card className="p-8 sm:p-10 rounded-2xl max-w-4xl mx-auto text-center shadow-sm">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mx-auto mb-5">
            <ShieldCheck className="w-7 h-7" aria-hidden="true" />
          </div>
          <h2 className="text-3xl mb-4">Une question concernant vos données ?</h2>
          <p className="text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-8">
            Notre équipe est disponible pour répondre à toutes vos questions relatives à la confidentialité.
          </p>
          <Button to="/contact">Nous contacter</Button>
        </Card>
      </InfoSection>
    </div>
  );
}
