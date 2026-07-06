import { Facebook, Instagram, Mail, MapPin, MessageCircle, Send, Twitter, Clock } from "lucide-react";
import { toast } from "react-toastify";

import Button from "../components/ui/Button";
import Card from "../components/ui/Card";
import {
  InfoBanner,
  InfoHero,
  InfoSection,
} from "../components/info/InfoPageShell";

const contactItems = [
  { label: "contact@yakalma.sn", icon: Mail, href: "mailto:contact@yakalma.sn" },
  { label: "Dakar, Sénégal", icon: MapPin },
  { label: "Lundi - Samedi, 8h - 20h", icon: Clock },
];

const socialLinks = [
  { label: "Facebook", href: "https://www.facebook.com/", icon: Facebook },
  { label: "Instagram", href: "https://www.instagram.com/", icon: Instagram },
  { label: "X", href: "https://x.com/", icon: Twitter },
];

export default function Contact() {
  const handleSubmit = (event) => {
    event.preventDefault();
    event.currentTarget.reset();
    toast.success("Votre message a bien été préparé. Nous revenons vers vous rapidement.");
  };

  return (
    <div className="min-h-screen bg-background-warm">
      <InfoBanner icon={MapPin}>
        Disponible à Dakar et ses environs.
      </InfoBanner>
      <InfoHero
        eyebrow="Contact"
        title="Nous contacter"
        description="Une question, une demande chef ou un besoin d'accompagnement ? L'équipe Yakalma vous répond avec attention."
      />

      <InfoSection>
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <Card className="p-6 sm:p-8 rounded-2xl h-fit">
            <MessageCircle className="w-12 h-12 text-primary mb-6" aria-hidden="true" />
            <h2 className="text-3xl mb-4">Restons en contact</h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              Nous vous accompagnons pour vos commandes, votre compte ou votre
              activité de chef partenaire.
            </p>

            <div className="space-y-4 mb-8">
              {contactItems.map(({ label, icon: Icon, href }) => {
                const content = (
                  <>
                    <span className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5" aria-hidden="true" />
                    </span>
                    <span className="font-medium text-foreground">{label}</span>
                  </>
                );

                return href ? (
                  <a
                    key={label}
                    href={href}
                    className="flex items-center gap-3 rounded-xl hover:text-primary transition-colors"
                  >
                    {content}
                  </a>
                ) : (
                  <div key={label} className="flex items-center gap-3">
                    {content}
                  </div>
                );
              })}
            </div>

            <div className="flex items-center gap-3">
              {socialLinks.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="w-11 h-11 rounded-full bg-primary/10 text-primary hover:bg-primary hover:text-white transition-colors flex items-center justify-center"
                >
                  <Icon className="w-5 h-5" aria-hidden="true" />
                </a>
              ))}
            </div>
          </Card>

          <Card className="p-6 sm:p-8 rounded-2xl">
            <h2 className="text-3xl mb-6">Envoyer un message</h2>
            <form onSubmit={handleSubmit} className="grid gap-5">
              <label className="grid gap-2 font-medium">
                Nom
                <input
                  name="name"
                  required
                  className="h-12 rounded-xl border border-border-warm bg-white px-4 font-normal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </label>
              <label className="grid gap-2 font-medium">
                Email
                <input
                  name="email"
                  type="email"
                  required
                  className="h-12 rounded-xl border border-border-warm bg-white px-4 font-normal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </label>
              <label className="grid gap-2 font-medium">
                Sujet
                <input
                  name="subject"
                  required
                  className="h-12 rounded-xl border border-border-warm bg-white px-4 font-normal focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </label>
              <label className="grid gap-2 font-medium">
                Message
                <textarea
                  name="message"
                  required
                  rows="6"
                  className="rounded-xl border border-border-warm bg-white px-4 py-3 font-normal resize-none focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
                />
              </label>
              <Button type="submit" className="w-full sm:w-fit">
                <Send className="w-5 h-5" aria-hidden="true" />
                Envoyer
              </Button>
            </form>
          </Card>
        </div>
      </InfoSection>
    </div>
  );
}

