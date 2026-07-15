import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Ebook } from "../types";
import { useCart } from "../context/CartContext";

export default function EbookDetailPage() {
  const { id } = useParams();
  const [ebook, setEbook] = useState<Ebook | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    api
      .get(`/ebooks/${id}/`)
      .then((res) => setEbook(res.data))
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  if (notFound || !ebook) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">E-book introuvable.</p>
        <Link to="/" className="text-black underline text-sm mt-4 inline-block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  function handleAcheter() {
    addToCart(ebook!, null);
    navigate("/checkout");
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-gray-500 hover:text-black">
        ← Retour
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div className="aspect-[3/4] bg-gray-100 overflow-hidden">
          <img src={ebook.image} alt={ebook.nom} className="w-full h-full object-cover" />
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">E-book</p>
          <h1 className="text-2xl font-bold mt-2">{ebook.nom}</h1>
          <p className="text-xl mt-4 font-semibold">{ebook.prix.toLocaleString()} FCFA</p>
          <p className="text-gray-600 mt-6 leading-relaxed">{ebook.description}</p>

          <button
            onClick={handleAcheter}
            className="mt-8 w-full md:w-auto bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
          >
            Acheter pour télécharger
          </button>
        </div>
      </div>

      {ebook.contenu && ebook.contenu.length > 0 && (
        <div className="mt-16 border-t border-gray-200 pt-10">
          <h2 className="text-xl font-bold mb-8">Contenu de l'E-book</h2>
          <div className="space-y-8">
            {ebook.contenu.map((item, index) => (
              <div key={item.id} className="flex gap-4">
                <div className="w-8 h-8 rounded-full bg-black text-white flex items-center justify-center text-sm font-semibold flex-shrink-0">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-sm">{item.titre}</h3>
                  <p className="text-gray-600 text-sm mt-1 leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}