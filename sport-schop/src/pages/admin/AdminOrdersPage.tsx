import { useState, useEffect, Fragment } from "react";
import api from "../../api/axios";
import { ChevronDown, ChevronUp } from "lucide-react";

type OrderItem = {
  quantite: number;
  prix_unitaire: number;
  nom_article: string;
  image_article: string | null;
};

type Order = {
  id: number;
  nom_client: string;
  telephone: string;
  ville: string;
  mode_paiement: string;
  statut: string;
  total: number;
  date_creation: string;
  items: OrderItem[];
};

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

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  function fetchOrders() {
    api.get("/admin/commandes/").then((res) => {
      setOrders(res.data);
      setLoading(false);
    });
  }

  async function handleStatutChange(orderId: number, newStatut: string) {
    await api.patch(`/admin/commandes/${orderId}/`, { statut: newStatut });
    fetchOrders();
  }

  function toggleExpand(orderId: number) {
    setExpanded(expanded === orderId ? null : orderId);
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Commandes</h1>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600"></th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">#</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Client</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Ville</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Paiement</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Articles</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Total</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Date</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Statut</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <Fragment key={order.id}>
                <tr className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3">
                    <button onClick={() => toggleExpand(order.id)} className="text-gray-400 hover:text-black">
                      {expanded === order.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-medium">#{order.id}</td>
                  <td className="px-4 py-3">
                    {order.nom_client}
                    <span className="block text-xs text-gray-400">{order.telephone}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-500">{order.ville}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs break-words max-w-[150px]">{order.mode_paiement}</td>
                  <td className="px-4 py-3 text-gray-500">{order.items.length}</td>
                  <td className="px-4 py-3 font-medium">{order.total.toLocaleString()} FCFA</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {new Date(order.date_creation).toLocaleDateString("fr-FR")}
                  </td>
                  <td className="px-4 py-3">
                    <select
                      value={order.statut}
                      onChange={(e) => handleStatutChange(order.id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded border-0 font-medium ${statutColors[order.statut]}`}
                    >
                      {Object.entries(statutLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                      ))}
                    </select>
                  </td>
                </tr>

                {expanded === order.id && (
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <td colSpan={9} className="px-4 py-4">
                      <p className="text-xs font-medium text-gray-500 mb-3">Articles commandés</p>
                      <div className="space-y-2">
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 bg-white border border-gray-200 rounded p-2">
                            {item.image_article && (
                              <img src={item.image_article} alt="" className="w-10 h-10 object-cover rounded" />
                            )}
                            <div className="flex-1">
                              <p className="text-sm font-medium">{item.nom_article}</p>
                              <p className="text-xs text-gray-500">
                                Quantité : {item.quantite} × {item.prix_unitaire.toLocaleString()} FCFA
                              </p>
                            </div>
                            <p className="text-sm font-medium">
                              {(item.quantite * item.prix_unitaire).toLocaleString()} FCFA
                            </p>
                          </div>
                        ))}
                      </div>
                    </td>
                  </tr>
                )}
                </Fragment>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}