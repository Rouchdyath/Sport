import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import {
  Package, MapPin, Download, Upload, AlertTriangle, RefreshCw,
  Truck, PlusCircle, FileUp, GraduationCap, SlidersHorizontal,
} from "lucide-react";

export default function AdminDashboardPage() {
  const [produits, setProduits] = useState<any[]>([]);
  const [ebooks, setEbooks] = useState<any[]>([]);
  const [commandes, setCommandes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAll() {
      try {
        const [pRes, eRes, cRes] = await Promise.all([
          api.get("/admin/produits/"),
          api.get("/admin/ebooks/"),
          api.get("/admin/commandes/"),
        ]);
        setProduits(pRes.data);
        setEbooks(eRes.data);
        setCommandes(cRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchAll();
  }, []);

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  const enAttente = commandes.filter((c) => c.statut === "en_attente").length;
  const confirmees = commandes.filter((c) => c.statut === "confirmee").length;

  // Articles en stock faible (produits sans variantes, stock <= 5 ; variantes idem)
  const articlesStockFaible: any[] = [];
  produits.forEach((p) => {
    if (p.variants?.length > 0) {
      p.variants.forEach((v: any) => {
        if (v.stock <= 5) {
          articlesStockFaible.push({ nom: `${p.nom} (${v.couleur}/${v.qualite})`, code: `VAR-${v.id}`, stock: v.stock, min: 5 });
        }
      });
    } else if (p.stock <= 5) {
      articlesStockFaible.push({ nom: p.nom, code: `PROD-${p.id}`, stock: p.stock, min: 5 });
    }
  });

  // Activité récente = 5 dernières commandes (le plus proche d'un "mouvement de stock" qu'on ait)
  const activiteRecente = [...commandes]
    .sort((a, b) => new Date(b.date_creation).getTime() - new Date(a.date_creation).getTime())
    .slice(0, 5);

  const actions = [
    { label: "Nouveau produit", sub: "Ajouter un article", icon: PlusCircle, color: "bg-[#2B71E3]", link: "/admin-dashboard/produits/nouveau" },
    { label: "Nouvel e-book", sub: "Publier un guide", icon: FileUp, color: "bg-[#22B857]", link: "/admin-dashboard/ebooks/nouveau" },
    { label: "Nouvelle formation", sub: "Créer un parcours", icon: GraduationCap, color: "bg-[#A044E3]", link: "/admin-dashboard/formations/nouveau" },
    { label: "Ajuster stock", sub: "Corriger les niveaux", icon: SlidersHorizontal, color: "bg-[#FE7119]", link: "/admin-dashboard/produits" },
    { label: "Commandes", sub: "Voir & traiter", icon: Truck, color: "bg-[#EA323A]", link: "/admin-dashboard/commandes" },
  ];

  const cards = [
    { label: "Total produits", value: produits.length, icon: Package, color: "bg-[#2B71E3]" },
    { label: "E-books publiés", value: ebooks.length, icon: MapPin, color: "bg-[#22B857]" },
    { label: "Commandes en attente", value: enAttente, icon: Download, color: "bg-[#FE7119]" },
    { label: "Commandes confirmées", value: confirmees, icon: Upload, color: "bg-[#A044E3]" },
  ];

  return (
    <div className="p-8">
      <div className="flex flex-wrap items-start justify-between gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#14231F]">Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Bienvenue dans votre espace de gestion</p>
        </div>

        <div className="flex flex-wrap gap-2.5">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <Link
                key={action.label}
                to={action.link}
                className={`${action.color} text-white rounded-lg px-4 py-2.5 flex items-center gap-2 hover:opacity-90 transition`}
              >
                <Icon size={16} />
                <div className="text-left leading-tight">
                  <p className="text-xs font-semibold">{action.label}</p>
                  <p className="text-[10px] opacity-80">{action.sub}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5 mb-6">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white border border-gray-200 p-5 rounded-xl flex items-center justify-between">
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wide mb-1">{card.label}</p>
                <p className="text-2xl font-bold text-[#14231F]">{card.value}</p>
              </div>
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color}`}>
                <Icon size={20} className="text-white" />
              </div>
            </div>
          );
        })}
      </div>

      {articlesStockFaible.length > 0 && (
        <div className="bg-[#FFFCF4] border border-orange-100 rounded-xl p-5 mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={22} />
            <div>
              <p className="text-sm font-bold text-orange-700">Low Stock Alert</p>
              <p className="text-xs text-orange-600">{articlesStockFaible.length} items below threshold</p>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <RefreshCw size={16} className="text-gray-400" />
            <h2 className="font-bold text-[#14231F]">Recent Activity</h2>
          </div>
          <div className="space-y-4">
            {activiteRecente.map((commande) => (
              <div key={commande.id} className="flex items-center justify-between border-b border-gray-100 pb-3 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center">
                    <Upload size={14} className="text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#14231F]">CMD-{commande.id}</p>
                    <p className="text-xs text-gray-400">
                      {commande.nom_client} • {new Date(commande.date_creation).toLocaleDateString("fr-FR")}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full font-medium">
                    {commande.statut}
                  </span>
                  <p className="text-sm font-bold text-red-500 mt-1">
                    -{commande.total.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
            {activiteRecente.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Aucune activité récente.</p>
            )}
          </div>
        </div>

        {/* Low Stock Alerts */}
        <div className="bg-white border border-gray-200 rounded-xl p-5">
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle size={16} className="text-orange-500" />
            <h2 className="font-bold text-[#14231F]">Low Stock Alerts</h2>
          </div>
          <div className="space-y-4">
            {articlesStockFaible.slice(0, 4).map((article, i) => (
              <div key={i}>
                <div className="flex items-center justify-between mb-1">
                  <p className="text-sm font-semibold text-[#14231F]">{article.nom}</p>
                  <span className="text-[10px] bg-orange-50 text-orange-600 px-2 py-0.5 rounded-full font-medium">
                    {article.code}
                  </span>
                </div>
                <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
                  <span>Current: {article.stock}</span>
                  <span>Min: {article.min}</span>
                </div>
                <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-[#FE7119] rounded-full"
                    style={{ width: `${Math.min((article.stock / article.min) * 100, 100)}%` }}
                  />
                </div>
              </div>
            ))}
            {articlesStockFaible.length === 0 && (
              <p className="text-sm text-gray-400 text-center py-4">Aucune alerte de stock.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}