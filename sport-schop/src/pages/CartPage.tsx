import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, total } = useCart();
  const navigate = useNavigate();

  function getKey(item: (typeof items)[number]) {
    return item.variant ? `variant-${item.variant.id}` : `product-${item.product.id}`;
  }

  function getStock(item: (typeof items)[number]) {
    if (item.variant) return item.variant.stock;
    return "stock" in item.product ? item.product.stock : Infinity;
  }

  const hasStockIssue = items.some((item) => {
    const stock = getStock(item);
    return stock === 0 || item.quantity > stock;
  });

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">
          Découvrez nos produits et ajoutez-en à votre panier.
        </p>
        <Link
          to="/produits"
          className="inline-block bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-primary-dark transition"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Mon Panier</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-6">
          {items.map((item) => {
            const key = getKey(item);
            const prix = item.variant ? item.variant.prix : (item.product as any).prix ?? 0;
            const image = item.variant ? item.variant.image : (item.product as any).image ?? "";
            const stock = getStock(item);
            const stockWarning = stock === 0
              ? "Rupture de stock. Retire cet article ou attends le réapprovisionnement."
              : item.quantity > stock
              ? `Quantité demandée supérieure au stock disponible. Stock restant : ${stock}.`
              : "";

            return (
              <div key={key} className="border-b border-gray-200 pb-6">
                <div className="flex items-center gap-4">
                  <div className="w-24 h-24 bg-gray-100 overflow-hidden flex-shrink-0">
                    <img src={image} alt={item.product.nom} className="w-full h-full object-cover" />
                  </div>

                  <div className="flex-1">
                    <h3 className="font-medium text-sm">{item.product.nom}</h3>
                    {item.variant && (
                      <p className="text-xs text-gray-500 mt-1">
                        {item.variant.couleur} — {item.variant.qualite}
                      </p>
                    )}
                    <p className="text-sm mt-2">{prix.toLocaleString()} FCFA</p>
                    <p className={`text-xs mt-1 ${stock === 0 ? "text-red-600" : "text-gray-500"}`}>
                      {stock === 0
                        ? "Rupture de stock"
                        : `Stock disponible : ${stock}`}
                    </p>
                  </div>

                  <div className="flex items-center gap-2 border border-gray-300">
                  <button onClick={() => updateQuantity(key, item.quantity - 1)} className="px-3 py-1 hover:bg-gray-100">−</button>
                  <span className="px-2 text-sm">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(key, item.quantity + 1)}
                    className="px-3 py-1 hover:bg-gray-100"
                    disabled={item.quantity >= stock || stock === 0}
                  >
                    +
                  </button>
                </div>

                <p className="text-sm font-medium w-24 text-right">
                  {(prix * item.quantity).toLocaleString()} FCFA
                </p>

                <button onClick={() => removeFromCart(key)} className="text-gray-400 hover:text-red-600 text-sm">✕</button>
              </div>
              {stockWarning && (
                <p className="text-sm text-red-600 mt-2 ml-28">
                  {stockWarning}
                </p>
              )}
            </div>
            );
          })}
        </div>

        <div className="border border-gray-200 p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Résumé de la commande</h2>
          <div className="flex justify-between text-sm text-gray-600 mb-2">
            <span>Sous-total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Livraison</span>
            <span>Calculée à l'étape suivante</span>
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-base mb-6">
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
          {hasStockIssue && (
            <p className="text-sm text-red-600 mb-4">
              Votre panier contient un article en rupture de stock ou la quantité demandée est supérieure au stock disponible.
            </p>
          )}
          <button
            onClick={() => navigate("/checkout")}
            className="w-full bg-primary text-white py-3 text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
            disabled={hasStockIssue}
          >
            Passer la commande
          </button>
          <Link to="/produits" className="block text-center text-sm text-gray-500 hover:text-black mt-4">
            ← Continuer mes achats
          </Link>
        </div>
      </div>
    </div>
  );
}