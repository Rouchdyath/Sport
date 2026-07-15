import { Link, useLocation } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <header
      className={
        isHome
          ? "absolute top-0 left-0 w-full z-20 bg-transparent"
          : "border-b border-gray-200 bg-white"
      }
    >
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/images/logos.png" alt="PRODOC Plus" className="h-10 w-auto" />
        </Link>

        <nav
          className={`hidden md:flex gap-8 text-sm font-medium ${
            isHome ? "text-white" : "text-gray-700"
          }`}
        >
          <Link to="/" className={isHome ? "hover:text-primary-light" : "hover:text-primary"}>Accueil</Link>
          <Link to="/produits" className={isHome ? "hover:text-primary-light" : "hover:text-primary"}>Produits</Link>
          <Link to="/ebooks" className={isHome ? "hover:text-primary-light" : "hover:text-primary"}>E-books</Link>
          <Link to="/contact" className={isHome ? "hover:text-primary-light" : "hover:text-primary"}>Contact</Link>
        </nav>

        <div className={`flex items-center gap-5 ${isHome ? "text-white" : ""}`}>
          <Link to="/panier" className={isHome ? "hover:text-primary-light" : "hover:text-primary"}>
            <ShoppingCart size={20} />
          </Link>

          {user ? (
            <Link
              to={user.is_staff ? "/admin-dashboard" : "/mon-compte"}
              className={isHome ? "hover:text-primary-light" : "hover:text-primary"}
              title={user.username}
            >
              <User size={20} />
            </Link>
          ) : (
            <Link to="/login" className={`text-sm font-medium ${isHome ? "hover:text-primary-light" : "hover:text-primary"}`}>
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}