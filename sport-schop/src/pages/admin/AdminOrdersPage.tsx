import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Eye, Truck, CheckCircle2, Clock, XCircle } from "lucide-react";

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
  telephone: string;
  adresse: string;
  ville: string;
  mode_paiement: string;
  statut: "en_attente" | "confirmee" | "livree" | "annulee";
  total: number;
  date_creation: string;
  items: OrderItem[];
};

const statutConfig = {
  en_attente: { label: "En attente", color: "bg-orange-50 text-orange-700", icon: Clock },
  confirmee: { label: "Confirmée", color: "bg-primary/10 text-primary-dark", icon: CheckCircle2 },
  livree: { label: "Livrée", color: "bg-green-50 text-green-700", icon: Truck },
  annulee: { label: "Annulée", color: "bg-red-50 text-red-700", icon: XCircle },
};

export default function AdminOrdersPage() {
  const [commandes, setCommandes] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtre, setFiltre] = useState<string>("toutes");
  const [detailOuvert, setDetailOuvert] = useState<number | null>(null);

  useEffect(() => {
    fetchCommandes();
  }, []);

  function fetchCommandes() {
    api.get("/admin/commandes/").then((res) => {
      setCommandes(res.data);
      setLoading(false);
    });
  }

  async function changerStatut(id: number, statut: string) {
    await api.patch(`/admin/commandes/${id}/`, { statut });
    fetchCommandes();
  }

  const commandesFiltrees =
    filtre === "toutes" ? commandes : commandes.filter((c) => c.statut === filtre);

  const tabs = [
    { key: "toutes", label: "Toutes" },
    { key: "en_attente", label: "En attente" },
    { key: "confirmee", label: "Confirmées" },
    { key: "livree", label: "Livrées" },
    { key: "annulee", label: "Annulées" },
  ];

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold text-[#14231F] mb-1">Commandes</h1>
      <p className="text-sm text-gray-500 mb-6">Total : {commandes.length} commandes</p>

      <div className="flex gap-2 mb-6 border-b border-gray-200">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setFiltre(tab.key)}
            className={`px-4 py-2.5 text-sm font-medium border-b-2 transition ${
              filtre === tab.key
                ? "border-primary text-primary-dark"
                : "border-transparent text-gray-500 hover:text-primary"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-500 text-xs uppercase tracking-wide">
            <tr>
              <th className="text-left px-5 py-3">Client</th>
              <th className="text-left px-5 py-3">Ville</th>
              <th className="text-left px-5 py-3">Paiement</th>
              <th className="text-left px-5 py-3">Total</th>
              <th className="text-left px-5 py-3">Statut</th>
              <th className="text-left px-5 py-3">Date</th>
              <th className="text-left px-5 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {commandesFiltrees.map((commande) => {
              const config = statutConfig[commande.statut];
              const StatutIcon = config.icon;
              return (
                <>
                  <tr key={commande.id} className="border-t border-gray-100 hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <p className="font-medium text-[#14231F]">{commande.nom_client}</p>
                      <p className="text-xs text-gray-400">{commande.telephone}</p>
                    </td>
                    <td className="px-5 py-4 text-gray-600">{commande.ville}</td>
                    <td className="px-5 py-4 text-gray-600">{commande.mode_paiement}</td>
                    <td className="px-5 py-4 font-semibold text-[#14231F]">
                      {commande.total.toLocaleString()} FCFA
                    </td>
                    <td className="px-5 py-4">
                      <select
                        value={commande.statut}
                        onChange={(e) => changerStatut(commande.id, e.target.value)}
                        className={`text-xs font-medium rounded-full px-3 py-1.5 border-0 cursor-pointer ${config.color}`}
                      >
                        <option value="en_attente">En attente</option>
                        <option value="confirmee">Confirmée</option>
                        <option value="livree">Livrée</option>
                        <option value="annulee">Annulée</option>
                      </select>
                    </td>
                    <td className="px-5 py-4 text-gray-500 text-xs">
                      {new Date(commande.date_creation).toLocaleDateString("fr-FR")}
                    </td>
                    <td className="px-5 py-4">
                      <button
                        onClick={() => setDetailOuvert(detailOuvert === commande.id ? null : commande.id)}
                        className="text-gray-400 hover:text-primary"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                  {detailOuvert === commande.id && (
                    <tr className="bg-gray-50/50">
                      <td colSpan={7} className="px-5 py-4">
                        <p className="text-xs text-gray-500 mb-2">Adresse : {commande.adresse}</p>
                        <div className="space-y-1">
                          {commande.items.map((item, i) => (
                            <p key={i} className="text-xs text-gray-600">
                              • Article #{item.product ?? item.variant ?? item.ebook} × {item.quantite} —{" "}
                              {(item.prix_unitaire * item.quantite).toLocaleString()} FCFA
                            </p>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              );
            })}
          </tbody>
        </table>

        {commandesFiltrees.length === 0 && (
          <p className="text-center text-gray-400 py-10 text-sm">Aucune commande dans cette catégorie.</p>
        )}
      </div>
    </div>
  );
}