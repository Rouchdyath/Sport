import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";

type OrderItem = {
  product: number | null;
  variant: number | null;
  ebook: number | null;
  quantite: number;
  prix_unitaire: number;
};

type Order = {
  id: number;
  nom_client: string;
  statut: string;
  total: number;
  date_creation: string;
  items: OrderItem[];
};

export default function MonComptePage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/mes-commandes/").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }, []);

  function handleLogout() {
    logout();
    navigate("/");
  }

  const statutLabels: Record<string, string> = {
    en_attente: "En attente",
    confirmee: "Confirmée",
    livree: "Livrée",
    annulee: "Annulée",
  };

  const statutColors: Record<string, string> = {
    en_attente: "bg-yellow-100 text-yellow-800",
    confirmee: "bg-blue-100 text-blue-800",
    livree: "bg-green-100 text-green-800",
    annulee: "bg-red-100 text-red-800",
  };

  return (
  <div className="max-w-4xl mx-auto px-6 py-12">
    <div className="flex items-center justify-between mb-8">
     <div>
       <h1 className="text-2xl font-bold">
          Bienvenue{user?.first_name ? `, ${user.first_name}` : ""} 
        </h1>
        <p className="text-gray-500 text-sm mt-1">
          Ravi de vous revoir ! Voici un aperçu de votre compte.
        </p>
        <p className="text-gray-400 text-xs mt-1">{user?.email}</p>
     </div>
      <button
        onClick={handleLogout}
        className="text-sm text-gray-500 hover:text-black underline"
      >
        Déconnexion
      </button>
    </div>


      <h2 className="font-semibold text-lg mb-4">Historique de mes commandes</h2>

      {loading ? (
        <p className="text-gray-500 text-sm">Chargement...</p>
      ) : orders.length === 0 ? (
        <p className="text-gray-500 text-sm">Aucune commande pour l'instant.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div key={order.id} className="border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Commande #{order.id}</span>
                <span className={`text-xs px-2 py-1 rounded ${statutColors[order.statut]}`}>
                  {statutLabels[order.statut]}
                </span>
              </div>
              <p className="text-xs text-gray-500">
                {new Date(order.date_creation).toLocaleDateString("fr-FR")}
              </p>
              <p className="text-sm font-semibold mt-2">{order.total.toLocaleString()} FCFA</p>
              <p className="text-xs text-gray-500 mt-1">{order.items.length} article(s)</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}