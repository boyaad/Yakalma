import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LuChefHat,
  LuMenu,
  LuX,
  LuShoppingCart,
  LuSearch,
  LuUser,
} from "react-icons/lu";
import { Home, UtensilsCrossed } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import Button from "./Button";
import logo from "../../assets/logo.png";

function Navbar() {
  const { user } = useAuth();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { name: "Accueil", path: "/" },
    { name: "Catalogue", path: "/plats" },
  ];

  const isActive = (path) => location.pathname === path;
  const isProfilePage = location.pathname === "/profile";

  return (
    <nav className="w-full bg-white border-b border-border-warm sticky top-0 z-40">
      {/* Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16 md:h-[72px] lg:h-20">
          {/* Logo Section */}
          <div className="flex-shrink-0 flex items-center">
            <Link
              to="/"
              className="flex items-center group"
              aria-label="Yakalma"
            >
              <img
                src={logo}
                alt="Yakalma"
                className="h-10 w-auto md:h-11 lg:h-12 object-contain group-hover:opacity-90 transition-opacity"
              />
            </Link>
          </div>

          {/* Centered Navigation Links (Desktop/Tablet) */}
          <div
            className={`hidden md:flex items-center ${
              isProfilePage
                ? "gap-10 bg-transparent p-0 border-0"
                : "gap-1 bg-background-warm p-1 rounded-full border border-border-warm/50"
            }`}
          >
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`font-poppins font-semibold transition-all duration-300 ${
                  isProfilePage
                    ? "inline-flex items-center gap-2 text-base text-foreground hover:text-primary"
                    : `px-5 py-2 text-sm rounded-full ${
                        isActive(link.path)
                          ? "bg-primary text-white shadow-sm"
                          : "text-muted-foreground hover:text-primary hover:bg-white/50"
                      }`
                }`}
              >
                {isProfilePage &&
                  (link.path === "/" ? (
                    <Home className="w-4 h-4" />
                  ) : (
                    <UtensilsCrossed className="w-4 h-4" />
                  ))}
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Action Section (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {!isProfilePage && (
              <>
                <button className="text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-background-warm transition-colors cursor-pointer">
                  <LuSearch size={20} />
                </button>
                <Link
                  to="/panier"
                  className="text-muted-foreground hover:text-primary p-2 rounded-full hover:bg-background-warm transition-colors relative cursor-pointer"
                  aria-label="Voir mon panier"
                >
                  <LuShoppingCart size={20} />
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white rounded-full text-[10px] font-bold flex items-center justify-center">
                    0
                  </span>
                </Link>
              </>
            )}

            {user && !isProfilePage ? (
              <Link to="/dashboard">
                <Button
                  size="sm"
                  variant="secondary"
                  className="flex items-center gap-1.5"
                >
                  <LuUser size={16} />
                  <span>Mon Espace</span>
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link
                  to="/login"
                  className="font-poppins font-semibold text-sm text-foreground/80 hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link to="/register">
                  <Button size="sm" variant="primary">
                    <LuChefHat size={16} />
                    Devenir chef
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Hamburger / Cart Section (Mobile - < 768px) */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              to="/panier"
              className="text-muted-foreground hover:text-primary p-2 rounded-full relative cursor-pointer"
              aria-label="Voir mon panier"
            >
              <LuShoppingCart size={20} />
              <span className="absolute top-1 right-1 w-4.5 h-4.5 bg-primary text-white rounded-full text-[9px] font-bold flex items-center justify-center">
                0
              </span>
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-foreground hover:text-primary p-2 rounded-lg transition-colors cursor-pointer"
              aria-label="Menu principal"
            >
              {isOpen ? <LuX size={24} /> : <LuMenu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-border-warm bg-white py-4 px-6 shadow-lg animate-fade-in flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsOpen(false)}
                className={`px-4 py-3 font-poppins font-semibold text-base rounded-xl transition-all ${
                  isActive(link.path)
                    ? "bg-primary text-white"
                    : "text-foreground hover:text-primary hover:bg-background-warm"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="border-t border-border-warm/60 pt-4 flex flex-col gap-3">
            <div className="flex items-center justify-between px-2 text-muted-foreground">
              <span className="font-poppins text-sm">Rechercher un plat</span>
              <button className="p-2 rounded-full hover:bg-background-warm">
                <LuSearch size={18} />
              </button>
            </div>

            {user ? (
              <Link to="/dashboard" onClick={() => setIsOpen(false)}>
                <Button size="md" variant="secondary" className="w-full">
                  <LuUser size={18} />
                  <span>Mon Espace</span>
                </Button>
              </Link>
            ) : (
              <div className="flex flex-col gap-2 mt-2">
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <Button size="md" variant="secondary" className="w-full">
                    Connexion
                  </Button>
                </Link>
                <Link to="/register" onClick={() => setIsOpen(false)}>
                  <Button size="md" variant="primary" className="w-full">
                    <LuChefHat size={18} />
                    Devenir chef
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
