import { Link } from "react-router-dom";
import { ShoppingCart, User } from "lucide-react";
import { useAuth } from "../context/AuthContext";

export default function Header() {
  const { user } = useAuth();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto flex items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center flex-shrink-0">
          <img src="/images/logos.png" alt="PRODOC Plus" className="h-10 w-auto" />
        </Link>

        <nav className="hidden md:flex gap-8 text-sm font-medium text-gray-700">
          <Link to="/" className="hover:text-primary">Accueil</Link>
          <Link to="/produits" className="hover:text-primary">Produits</Link>
          <Link to="/ebooks" className="hover:text-primary">E-books</Link>
          <Link to="/contact" className="hover:text-primary">Contact</Link>
        </nav>

        <div className="flex items-center gap-5">
          <Link to="/panier" className="hover:text-primary">
            <ShoppingCart size={20} />
          </Link>

          {user ? (
            <Link
              to={user.is_staff ? "/admin-dashboard" : "/mon-compte"}
              className="hover:text-primary"
              title={user.username}
            >
              <User size={20} />
            </Link>
          ) : (
            <Link to="/login" className="text-sm font-medium hover:text-primary">
              Connexion
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}