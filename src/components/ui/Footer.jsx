import { Link } from "react-router-dom";
import { ChefHat, MapPin, Facebook, Instagram, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-[#2d2d2d] text-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <ChefHat className="w-8 h-8 text-primary" />
              <span className="text-2xl font-semibold">Yakalma</span>
            </div>
            <p className="text-white/70 mb-4">
              La marketplace des plats faits maison. Savourez l'authenticité.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.facebook.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://www.instagram.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a
                href="https://x.com/"
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="w-10 h-10 rounded-full bg-white/10 hover:bg-primary transition-colors flex items-center justify-center"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Explorer</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/plats"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Catalogue
                </Link>
              </li>
              <li>
                <Link
                  to="/#nos_talent"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Nos talents
                </Link>
              </li>
              <li>
                <Link
                  to="/register"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Devenir chef
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">À propos</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/qui-sommes-nous"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Qui sommes-nous
                </Link>
              </li>
              <li>
                <Link
                  to="/comment-ca-marche"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Comment ça marche
                </Link>
              </li>
              <li>
                <Link
                  to="/carrieres"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Carrières
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link
                  to="/centre-aide"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link
                  to="/contact"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link
                  to="/cgu"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  CGU
                </Link>
              </li>
              <li>
                <Link
                  to="/politique-confidentialite"
                  className="text-white/70 hover:text-white transition-colors"
                >
                  Politique de confidentialité
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm">
            © 2026 Yakalma. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2 text-white/60 text-sm">
            <MapPin className="w-4 h-4" />
            <span>Disponible à Dakar et ses environs</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
