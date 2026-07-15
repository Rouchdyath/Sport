import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Package, BookOpen, ShoppingBag, AlertTriangle } from "lucide-react";

type Stats = {
  totalProduits: number;
  totalEbooks: number;
  totalCommandes: number;
  ruptureStock: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats>({
    totalProduits: 0,
    totalEbooks: 0,
    totalCommandes: 0,
    ruptureStock: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      const [produitsRes, ebooksRes, commandesRes] = await Promise.all([
        api.get("/admin/produits/"),
        api.get("/admin/ebooks/"),
        api.get("/admin/commandes/"),
      ]);

      const produits = produitsRes.data;
      const rupture = produits.filter((p: any) => {
        const stockTotal = p.variants.length > 0
          ? p.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
          : p.stock;
        return stockTotal === 0;
      }).length;

      setStats({
        totalProduits: produits.length,
        totalEbooks: ebooksRes.data.length,
        totalCommandes: commandesRes.data.length,
        ruptureStock: rupture,
      });
      setLoading(false);
    }
    fetchStats();
  }, []);

  if (loading) {
    return <div className="p-8 text-gray-500">Chargement...</div>;
  }

  const cards = [
    { label: "Produits", value: stats.totalProduits, icon: Package, link: "/admin-dashboard/produits", color: "bg-blue-50 text-blue-700" },
    { label: "E-books", value: stats.totalEbooks, icon: BookOpen, link: "/admin-dashboard/ebooks", color: "bg-purple-50 text-purple-700" },
    { label: "Commandes", value: stats.totalCommandes, icon: ShoppingBag, link: "/admin-dashboard/commandes", color: "bg-green-50 text-green-700" },
    { label: "Ruptures de stock", value: stats.ruptureStock, icon: AlertTriangle, link: "/admin-dashboard/produits", color: "bg-red-50 text-red-700" },
  ];

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-8">Vue d'ensemble</h1>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link
              key={card.label}
              to={card.link}
              className="bg-white border border-gray-200 p-5 rounded-lg hover:shadow-md transition"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${card.color} mb-3`}>
                <Icon size={20} />
              </div>
              <p className="text-2xl font-bold">{card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </Link>
          );
        })}
      </div>

      {stats.ruptureStock > 0 && (
        <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
          <AlertTriangle className="text-red-600 flex-shrink-0" size={20} />
          <p className="text-sm text-red-800">
            {stats.ruptureStock} produit(s) en rupture de stock.{" "}
            <Link to="/admin-dashboard/produits" className="underline font-medium">
              Voir les produits
            </Link>
          </p>
        </div>
      )}
    </div>
  );
}