import { ChefHat } from "lucide-react";
import { FeatureCard } from "./FeatureCard";

const customerFeatures = [
  {
    title: "Des milliers de plats",
    description: "Découvrez une variété infinie de saveurs authentiques",
  },
  {
    title: "Livraison rapide",
    description: "Recevez vos plats chauds en moins de 30 minutes",
  },
  {
    title: "Paiement sécurisé",
    description: "Transactions 100% sécurisées et protégées",
  },
];

const sellerFeatures = [
  {
    title: "Valorisez votre talent",
    description: "Gagnez un revenu en cuisinant ce que vous aimez",
  },
  {
    title: "Gestion simplifiée",
    description: "Dashboard complet pour gérer vos plats et commandes",
  },
  {
    title: "Support dédié",
    description: "Équipe disponible pour vous accompagner",
  },
];

export function LeftPanel({ accountType }) {
  const features =
    accountType === "customer" ? customerFeatures : sellerFeatures;
  const subtitle =
    accountType === "customer"
      ? "Commandez des plats authentiques préparés avec passion"
      : "Partagez votre talent culinaire avec des milliers de gourmets";

  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-[#b85420] to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0tMTYgMGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHptMzIgMzJjMCAyLjIxIDEuNzkgNCA0IDRzNC0xLjc5IDQtNC0xLjc5LTQtNC00LTQgMS43OS00IDR6bS0xNiAwYzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
        <div className="max-w-md">
          <ChefHat className="w-20 h-20 mb-8" />

          <h2 className="text-4xl font-semibold mb-4">
            Rejoignez la communauté Yakalma
          </h2>
          <p className="text-lg text-white/90 mb-12">{subtitle}</p>

          <div className="space-y-4">
            {features.map((feature, index) => (
              <FeatureCard
                key={index}
                title={feature.title}
                description={feature.description}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
