import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";
import { useCart } from "../context/CartContext";
import { hasVariants } from "../utils/product";
import { useAuth } from "../context/AuthContext";

export default function ProductDetailPage() {
   const { user } = useAuth();
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/produits/${id}/`);
        setProduct(res.data);
      } catch (err) {
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  if (notFound || !product) {
    return (
      <div className="max-w-6xl mx-auto px-6 py-16 text-center">
        <p className="text-gray-500">Produit introuvable.</p>
        <Link to="/" className="text-black underline text-sm mt-4 inline-block">
          Retour à l'accueil
        </Link>
      </div>
    );
  }

  const withVariants = hasVariants(product);
  const selectedVariant = withVariants ? product.variants[selectedVariantIndex] : null;

  const displayImage = selectedVariant ? selectedVariant.image : product.image;
  const displayPrix = selectedVariant ? selectedVariant.prix : product.prix ?? 0;
  const availableStock = selectedVariant ? selectedVariant.stock : product.stock ?? 0;
  const isSoldOut = availableStock === 0;

  function handleAddToCart() {
    addToCart(product!, selectedVariant);
    if (user) {
      navigate("/panier");
    }
  }

 function handleBuyNow() {
    addToCart(product!, selectedVariant);
    if (user) {
      navigate("/checkout");
    } else {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <Link to="/" className="text-sm text-gray-500 hover:text-black">
        ← Retour
      </Link>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-12">
        <div>
          <div className="aspect-square bg-gray-100 overflow-hidden">
            <img
              src={displayImage ?? ""}
              alt={product.nom}
              className="w-full h-full object-cover"
            />
          </div>

          {withVariants && (
            <div className="flex gap-3 mt-4 flex-wrap">
              {product.variants.map((variant, index) => (
                <button
                  key={variant.id}
                  onClick={() => setSelectedVariantIndex(index)}
                  className={`w-24 h-24 overflow-hidden border-2 ${
                    selectedVariantIndex === index ? "border-black" : "border-transparent"
                  }`}
                >
                  <img
                    src={variant.image}
                    alt={variant.couleur}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        <div>
          <p className="text-sm text-gray-500 uppercase tracking-wide">{product.categorie}</p>
          <h1 className="text-2xl font-bold mt-2">{product.nom}</h1>

          {withVariants && selectedVariant && (
            <div className="mt-3 text-sm text-gray-600">
              <p>Couleur : <span className="font-medium text-black">{selectedVariant.couleur}</span></p>
              <p>Qualité : <span className="font-medium text-black">{selectedVariant.qualite}</span></p>
            </div>
          )}

          <p className="text-xl mt-4 font-semibold">{displayPrix.toLocaleString()} FCFA</p>
          <p className={`text-sm mt-2 ${isSoldOut ? "text-red-600" : "text-gray-500"}`}>
            {isSoldOut ? "Rupture de stock" : `Stock disponible : ${availableStock}`}
          </p>
          <p className="text-gray-600 mt-6 leading-relaxed">{product.description}</p>

          <div className="mt-8 flex flex-col md:flex-row gap-3">
            <button
              onClick={handleAddToCart}
              className="w-full md:w-auto border border-black px-8 py-3 text-sm font-medium hover:bg-gray-100 transition disabled:opacity-50"
              disabled={isSoldOut}
            >
              Ajouter au panier
            </button>
            <button
              onClick={handleBuyNow}
              className="w-full md:w-auto bg-black text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition disabled:opacity-50"
              disabled={isSoldOut}
            >
              Acheter maintenant
            </button>
          </div>
          {isSoldOut && (
            <p className="mt-4 text-red-600 text-sm">
              Ce produit est en rupture de stock et ne peut pas être ajouté au panier.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}