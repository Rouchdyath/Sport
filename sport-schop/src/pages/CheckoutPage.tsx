import { useState, useEffect } from "react";
import { useNavigate, Link, useLocation } from "react-router-dom";
import api from "../api/axios";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import KkiapayButton from "../components/KkiapayButton";

export default function CheckoutPage() {
  const { items, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [envoi, setEnvoi] = useState(false);
  const [erreur, setErreur] = useState("");
  const [modePaiement, setModePaiement] = useState("livraison");

  const [form, setForm] = useState({
    nom: "",
    telephone: "",
    adresse: "",
    ville: "",
  });

  // Redirige vers la connexion si l'utilisateur n'est pas connecté
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login", { state: { from: "/checkout" } });
    }
  }, [user, authLoading]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  function buildOrderItems() {
    return items.map((item) => {
      const isEbook = "fichier_pdf" in item.product;
      return {
        product: isEbook ? null : item.variant ? null : item.product.id,
        variant: item.variant ? item.variant.id : null,
        ebook: isEbook ? item.product.id : null,
        quantite: item.quantity,
        prix_unitaire: item.variant ? item.variant.prix : (item.product as any).prix,
      };
    });
  }

  function getEbooksAchetes() {
    return items
      .filter((item) => "fichier_pdf" in item.product)
      .map((item) => item.product);
  }

  // Paiement classique (à la livraison)
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setEnvoi(true);
    setErreur("");

    try {
      await api.post("/commandes/", {
        nom_client: form.nom,
        telephone: form.telephone,
        adresse: form.adresse,
        ville: form.ville,
        mode_paiement: "Paiement à la livraison",
        total: total,
        items: buildOrderItems(),
      });

      const ebooksAchetes = getEbooksAchetes();
      clearCart();
      navigate("/confirmation", { state: { ebooksAchetes } });
    } catch (err) {
      setErreur("Erreur lors de l'envoi de la commande. Vérifie ta connexion et réessaie.");
    } finally {
      setEnvoi(false);
    }
  }

  // Paiement via KKiaPay (après succès du widget)
  async function handleSubmitAvecPaiement(transactionId: string) {
    setEnvoi(true);
    setErreur("");

    try {
      await api.post("/commandes/", {
        nom_client: form.nom,
        telephone: form.telephone,
        adresse: form.adresse,
        ville: form.ville,
        mode_paiement: `KKiaPay (réf: ${transactionId})`,
        total: total,
        items: buildOrderItems(),
      });

      const ebooksAchetes = getEbooksAchetes();
      clearCart();
      navigate("/confirmation", { state: { ebooksAchetes } });
    } catch (err) {
      setErreur(
        "Paiement reçu mais erreur lors de l'enregistrement de la commande. Contacte le support avec cette référence : " +
          transactionId
      );
    } finally {
      setEnvoi(false);
    }
  }

  if (authLoading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Votre panier est vide</h1>
        <p className="text-gray-500 mb-8">Ajoutez des produits avant de passer commande.</p>
        <Link
          to="/produits"
          className="inline-block bg-primary text-white px-8 py-3 text-sm font-medium hover:bg-gray-800 transition"
        >
          Voir les produits
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8">Finaliser la commande</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-5">
          <h2 className="font-semibold text-lg mb-2">Informations de livraison</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nom complet</label>
            <input
              type="text" name="nom" required value={form.nom} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
              placeholder="Votre nom"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Téléphone</label>
            <input
              type="tel" name="telephone" required value={form.telephone} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
              placeholder="+229 00 00 00 00"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Adresse</label>
            <input
              type="text" name="adresse" required value={form.adresse} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
              placeholder="Quartier, rue, repère..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Ville</label>
            <input
              type="text" name="ville" required value={form.ville} onChange={handleChange}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
              placeholder="Cotonou, Porto-Novo..."
            />
          </div>

          <h2 className="font-semibold text-lg mb-2 pt-4">Mode de paiement</h2>
          <div className="space-y-3">
            <label className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded cursor-pointer">
              <input
                type="radio" name="paiement" value="livraison"
                checked={modePaiement === "livraison"}
                onChange={() => setModePaiement("livraison")}
              />
              <span className="text-sm">Paiement à la livraison</span>
            </label>
            <label className="flex items-center gap-3 border border-gray-300 px-4 py-3 rounded cursor-pointer">
              <input
                type="radio" name="paiement" value="kkiapay"
                checked={modePaiement === "kkiapay"}
                onChange={() => setModePaiement("kkiapay")}
              />
              <span className="text-sm">Payer maintenant (Mobile Money / Carte)</span>
            </label>
          </div>

          {erreur && <p className="text-red-600 text-sm">{erreur}</p>}

          {modePaiement === "kkiapay" ? (
            <KkiapayButton
              montant={total}
              disabled={envoi || !form.nom || !form.telephone || !form.adresse || !form.ville}
              onSuccess={(transactionId) => handleSubmitAvecPaiement(transactionId)}
            />
          ) : (
            <button
              type="submit"
              disabled={envoi}
              className="w-full bg-black text-white py-3 text-sm font-medium hover:bg-gray-800 transition mt-2 disabled:opacity-50"
            >
              {envoi ? "Envoi en cours..." : "Confirmer la commande"}
            </button>
          )}
        </form>

        <div className="border border-gray-200 p-6 h-fit">
          <h2 className="font-semibold text-lg mb-4">Résumé</h2>
          <div className="space-y-3 mb-4">
            {items.map((item) => {
              const key = item.variant ? `variant-${item.variant.id}` : `product-${item.product.id}`;
              const prix = item.variant ? item.variant.prix : (item.product as any).prix ?? 0;
              return (
                <div key={key} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.product.nom} × {item.quantity}
                    {item.variant && (
                      <span className="text-xs text-gray-400 block">
                        {item.variant.couleur} — {item.variant.qualite}
                      </span>
                    )}
                  </span>
                  <span>{(prix * item.quantity).toLocaleString()} FCFA</span>
                </div>
              );
            })}
          </div>
          <div className="border-t border-gray-200 pt-4 flex justify-between font-semibold text-base">
            <span>Total</span>
            <span>{total.toLocaleString()} FCFA</span>
          </div>
        </div>
      </div>
    </div>
  );
}