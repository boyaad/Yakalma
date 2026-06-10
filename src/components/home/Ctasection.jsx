import { ChefHat, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export function CtaSection() {
  return (
    <section className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-primary via-[#b85420] to-accent">
      <div className="max-w-4xl mx-auto text-center text-white">
        <ChefHat className="w-16 h-16 mx-auto mb-6" />
        <h2 className="text-3xl sm:text-4xl mb-4">
          Vous êtes chef ou cuisinier passionné ?
        </h2>
        <p className="text-lg sm:text-xl text-white/90 mb-8 max-w-2xl mx-auto">
          Rejoignez notre communauté et partagez vos créations culinaires avec
          des milliers de gourmets
        </p>
        <Button
          to="/signup"
          variant="white"
          className="px-8 py-4 shadow-lg hover:shadow-xl"
        >
          <span>Devenir chef partenaire</span>
          <ArrowRight className="w-5 h-5" />
        </Button>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-12 mt-12 pt-12 border-t border-white/20">
          <div className="text-center">
            <p className="text-3xl font-semibold mb-1">2,847</p>
            <p className="text-sm text-white/80">Clients actifs</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold mb-1">156</p>
            <p className="text-sm text-white/80">Chefs partenaires</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-semibold mb-1">4.8/5</p>
            <p className="text-sm text-white/80">Note moyenne</p>
          </div>
        </div>
      </div>
    </section>
  );
}
