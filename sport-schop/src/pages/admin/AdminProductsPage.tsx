import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Plus, MoreVertical, Pencil, Trash2, AlertTriangle } from "lucide-react";
import type { Product } from "../../types";
import { getDefaultDisplay } from "../../utils/product";

export default function AdminProductsPage() {
  const [produits, setProduits] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOuvert, setMenuOuvert] = useState<number | null>(null);

  useEffect(() => {
    fetchProduits();
  }, []);

  function fetchProduits() {
    api.get("/admin/produits/").then((res) => {
      setProduits(res.data);
      setLoading(false);
    });
  }

  async function handleDelete(id: number, nom: string) {
    if (!confirm(`Supprimer "${nom}" ? Cette action est irréversible.`)) return;
    await api.delete(`/admin/produits/${id}/`);
    fetchProduits();
  }

  function stockTotal(produit: any) {
    return produit.variants?.length > 0
      ? produit.variants.reduce((sum: number, v: any) => sum + v.stock, 0)
      : produit.stock;
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[#14231F]">Produits</h1>
        <Link
          to="/admin-dashboard/produits/nouveau"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-8">Total : {produits.length} produits</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {produits.map((produit: any) => {
          const stock = stockTotal(produit);
          const { prix, image } = getDefaultDisplay(produit);
          return (
            <div
              key={produit.id}
              className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition relative"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                  <img src={image ?? ""} alt={produit.nom} className="w-full h-full object-cover" />
                </div>
                <div className="relative">
                  <button
                    onClick={() => setMenuOuvert(menuOuvert === produit.id ? null : produit.id)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <MoreVertical size={18} />
                  </button>
                  {menuOuvert === produit.id && (
                    <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-10">
                      <Link
                        to={`/admin-dashboard/produits/${produit.id}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <Pencil size={14} /> Modifier
                      </Link>
                      <button
                        onClick={() => handleDelete(produit.id, produit.nom)}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                      >
                        <Trash2 size={14} /> Supprimer
                      </button>
                    </div>
                  )}
                </div>
              </div>
              <p className="font-semibold text-sm text-[#14231F] truncate">{produit.nom}</p>
              <p className="text-xs text-gray-500 mt-1">{produit.categorie}</p>
              <div className="flex items-center justify-between mt-2">
                <p className="text-sm font-bold text-primary-dark">
                  {(prix ?? 0).toLocaleString()} FCFA
                </p>
                {stock === 0 ? (
                  <span className="flex items-center gap-1 text-[10px] font-medium text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    <AlertTriangle size={10} /> Épuisé
                  </span>
                ) : (
                  <span className="text-[10px] font-medium text-gray-500">{stock} en stock</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}