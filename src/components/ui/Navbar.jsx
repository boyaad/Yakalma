import { useState } from "react";
import {
  Link,
  useLocation,
} from "react-router-dom";
import {
  LuChefHat,
  LuMenu,
  LuX,
} from "react-icons/lu";
import {
  Home,
  ShoppingCart,
  User,
  UtensilsCrossed,
} from "lucide-react";
import logo from "../../assets/logo.png";
import { useAuth } from "../../context/AuthContext";

function Navbar() {
  const { user, profile } = useAuth();
  const location =
    useLocation();
  const [isOpen, setIsOpen] =
    useState(false);

  const navLinks = [
    {
      name: "Accueil",
      path: "/",
      icon: Home,
    },
    {
      name: "Catalogue",
      path: "/plats",
      icon: UtensilsCrossed,
    },
  ];

  const isActive = (path) =>
    location.pathname ===
    path;

  return (
    <nav className="w-full bg-white sticky top-0 z-40 shadow-sm">
      <div className="w-full px-6 lg:px-10">
        <div className="flex h-18 items-center justify-between gap-7">
          <Link
            to="/"
            className="flex items-center shrink-0"
            aria-label="Yakalma"
          >
            <img
              src={logo}
              alt="Yakalma"
              className="h-12 w-auto object-contain"
            />
          </Link>

          <div className="hidden md:flex flex-1 items-center justify-center gap-4">
            {navLinks.map(
              (link) => (
                <NavbarLink
                  key={
                    link.path
                  }
                  link={link}
                  isActive={isActive(
                    link.path,
                  )}
                />
              ),
            )}
          </div>

          <div className="hidden md:flex items-center gap-8 shrink-0">
            {user ? (
              <>
                {
                  profile?.role === "acheteur" ? (
                    <>
                      <Link
                        to="/panier"
                        className="font-poppins font-semibold text-xl text-foreground hover:text-primary transition-colors"
                      >
                        <ShoppingCart color="black" size={24} />
                      </Link>
                      <Link
                        to="/profile"
                        className="font-poppins font-semibold text-xl text-foreground hover:text-primary transition-colors"
                      >
                        <User color="black" size={24} />
                      </Link>
                    </>
                  ) :  profile?.role === "vendeur" && (
                    <>
                      <Link
                        to="/seller/dashboard"
                        className="font-poppins font-semibold text-xl text-foreground hover:text-primary transition-colors"
                      >
                        Dashboard
                      </Link>
                    </>
                  )
                }
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="font-poppins font-semibold text-xl text-foreground hover:text-primary transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  className="h-12 inline-flex items-center gap-2.5 rounded-xl bg-primary px-6 text-xl font-poppins font-semibold text-white shadow-[0_6px_14px_rgba(160,67,10,0.22)] hover:bg-accent transition-all"
                >
                  <LuChefHat
                    size={20}
                  />
                  Devenir chef
                </Link>
              </>
            )}
          </div>

          <button
            onClick={() =>
              setIsOpen(
                !isOpen,
              )
            }
            className="md:hidden p-2 rounded-lg text-foreground hover:text-primary hover:bg-background-warm transition-colors"
            aria-label="Menu principal"
          >
            {isOpen ? (
              <LuX
                size={26}
              />
            ) : (
              <LuMenu
                size={26}
              />
            )}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white px-6 pb-5 shadow-lg animate-fade-in">
          <div className="flex flex-col gap-2">
            {navLinks.map(
              (link) => (
                <NavbarLink
                  key={
                    link.path
                  }
                  link={link}
                  isActive={isActive(
                    link.path,
                  )}
                  onClick={() =>
                    setIsOpen(
                      false,
                    )
                  }
                  mobile
                />
              ),
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            {user ? (
              profile?.role === "acheteur" ? (
                <>
                  <Link
                    to="/panier"
                    onClick={() => setIsOpen(false)}
                    className="h-12 inline-flex items-center gap-3 rounded-xl px-4 font-poppins font-semibold text-foreground hover:text-primary hover:bg-background-warm transition-colors"
                  >
                    <ShoppingCart size={20} />
                    Panier
                  </Link>
                  <Link
                    to="/profile"
                    onClick={() => setIsOpen(false)}
                    className="h-12 inline-flex items-center gap-3 rounded-xl px-4 font-poppins font-semibold text-foreground hover:text-primary hover:bg-background-warm transition-colors"
                  >
                    <User size={20} />
                    Profil
                  </Link>
                </>
              ) : (
                <Link
                  to="/seller/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="h-12 inline-flex items-center gap-3 rounded-xl px-4 font-poppins font-semibold text-foreground hover:text-primary hover:bg-background-warm transition-colors"
                >
                  Dashboard
                </Link>
              )
            ) : (
              <>
                <Link
                  to="/login"
                  onClick={() => setIsOpen(false)}
                  className="h-12 inline-flex items-center gap-3 rounded-xl px-4 font-poppins font-semibold text-foreground hover:text-primary hover:bg-background-warm transition-colors"
                >
                  Connexion
                </Link>
                <Link
                  to="/register"
                  onClick={() => setIsOpen(false)}
                  className="h-12 inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 font-poppins font-semibold text-white hover:bg-accent transition-colors"
                >
                  <LuChefHat size={20} />
                  Devenir chef
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavbarLink({
  link,
  isActive,
  onClick,
  mobile = false,
}) {
  const Icon = link.icon;

  return (
    <Link
      to={link.path}
      onClick={onClick}
      className={`inline-flex items-center gap-3 rounded-xl font-poppins font-semibold transition-all ${
        mobile
          ? "h-12 px-4 text-base"
          : "h-12 px-6 text-xl"
      } ${
        isActive
          ? "bg-primary text-white shadow-[0_6px_14px_rgba(160,67,10,0.22)]"
          : "text-foreground hover:bg-[#f3e6dc] hover:text-primary"
      }`}
    >
      <Icon className="w-5 h-5" />
      {link.name}
    </Link>
  );
}

export default Navbar;
