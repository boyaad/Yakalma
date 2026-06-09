import { ChefHat, CheckCircle } from "lucide-react";

export function LoginIllustration() {
  return (
    <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-primary via-[#b85420] to-accent relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmZmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSI+PHBhdGggZD0iTTM2IDE2YzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0em0tMTYgMGMwIDIuMjEgMS43OSA0IDQgNHM0LTEuNzkgNC00LTEuNzktNC00LTQtNCAxLjc5LTQgNHptMzIgMzJjMCAyLjIxIDEuNzkgNCA0IDRzNC0xLjc5IDQtNC0xLjc5LTQtNC00LTQgMS43OS00IDR6bS0xNiAwYzAgMi4yMSAxLjc5IDQgNCA0czQtMS43OSA0LTQtMS43OS00LTQtNC00IDEuNzktNCA0eiIvPjwvZz48L2c+PC9zdmc+')] opacity-20"></div>

      <div className="relative z-10 flex flex-col items-center justify-center p-12 text-white w-full">
        <div className="max-w-md text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-white/10 backdrop-blur-sm rounded-3xl transform rotate-6"></div>
            <div className="relative bg-white/20 backdrop-blur-md rounded-3xl p-8 border border-white/30 shadow-2xl">
              <ChefHat className="w-24 h-24 mx-auto mb-4" />
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="font-semibold text-2xl mb-1">2,847</div>
                  <div className="text-white/80 text-xs">Gourmets actifs</div>
                </div>
                <div className="bg-white/20 rounded-xl p-3">
                  <div className="font-semibold text-2xl mb-1">156</div>
                  <div className="text-white/80 text-xs">Chefs talentueux</div>
                </div>
              </div>
            </div>
          </div>

          <h2 className="text-3xl font-semibold mb-4">
            Bon retour sur Yakalma !
          </h2>
          <p className="text-lg text-white/90 mb-8">
            Retrouvez vos plats préférés et découvrez de nouvelles saveurs
            authentiques
          </p>

          <div className="space-y-3">
            {[
              "Livraison rapide en 30 min",
              "Paiement 100% sécurisé",
              "Support client réactif",
            ].map((text) => (
              <div
                key={text}
                className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl p-4 border border-white/20"
              >
                <CheckCircle className="w-5 h-5 text-green-300 flex-shrink-0" />
                <span className="text-sm text-white/90">{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
