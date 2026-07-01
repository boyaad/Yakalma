import { ChefHat, ArrowRight } from "lucide-react";
import Button from "../ui/Button";

export function Hero() {
  return (
    <section className="relative min-h-[560px] overflow-hidden lg:min-h-[700px]">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1665332195309-9d75071138f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhZnJpY2FuJTIwZm9vZCUyMHJpY2UlMjBmaXNofGVufDF8fHx8MTc4MDQ0MDcyMnww&ixlib=rb-4.1.0&q=80&w=1080"
          alt="Plat sénégalais authentique"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-transparent"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
      </div>

      {/* Content */}
      <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-4 py-20 sm:min-h-[600px] sm:px-6 sm:py-32 lg:min-h-[700px] lg:px-8 lg:py-40">
        <div className="max-w-2xl min-w-0">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/90 backdrop-blur-sm rounded-full mb-8 shadow-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-semibold text-foreground">
              350 chefs actifs
            </span>
          </div>

          {/* Main Title */}
          <h1 className="mb-6 break-words text-4xl leading-[1.12] text-white sm:text-6xl lg:text-7xl">
            Des plats faits maison,
            <span className="block text-amber-300 mt-3">livrés chez vous</span>
          </h1>

          {/* Description */}
          <p className="mb-10 max-w-xl text-base leading-relaxed text-white/90 sm:text-xl">
            Découvrez les saveurs authentiques de nos chefs passionnés.
            Commandez en quelques clics et régalez-vous !
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              to="/plats"
              variant="white"
              className="group px-8 py-4 text-lg hover:scale-105 shadow-xl"
            >
              <span>Explorer les plats</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              to="/register?role=chef"
              variant="outlineWhite"
              className="px-8 py-4 text-lg backdrop-blur-sm"
            >
              <ChefHat className="w-5 h-5" />
              <span>Devenir chef</span>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
