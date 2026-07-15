import { Link, useNavigate } from "react-router-dom";
import type { Ebook } from "../types";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";

export default function EbookCard({ ebook }: { ebook: Ebook }) {
  const { addToCart } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  function handleAcheter(e: React.MouseEvent) {
    e.preventDefault();
    addToCart(ebook, null);
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }

  return (
    <Link
      to={`/ebook/${ebook.id}`}
      className="block bg-white border border-gray-200 overflow-hidden hover:shadow-md transition"
    >
      <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
        <img src={ebook.image} alt={ebook.nom} className="w-full h-full object-cover" />
      </div>
      <div className="p-4 text-center">
        <h3 className="text-sm font-medium text-gray-800">{ebook.nom}</h3>
        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{ebook.description}</p>
        <p className="text-sm font-semibold mt-2">{ebook.prix.toLocaleString()} FCFA</p>
        <button
          onClick={handleAcheter}
          className="mt-3 w-full bg-primary text-white py-2 text-sm font-medium hover:bg-primary-dark transition"
        >
          Voir / Acheter
        </button>
      </div>
    </Link>
  );
}