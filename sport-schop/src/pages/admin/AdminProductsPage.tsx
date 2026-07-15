import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Product } from "../../types";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  function fetchProducts() {
    api.get("/admin/produits/").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }

  function getStockTotal(product: Product) {
    if (product.variants && product.variants.length > 0) {
      return product.variants.reduce((sum, v) => sum + (v as any).stock, 0);
    }
    return (product as any).stock ?? 0;
  }

  async function handleDelete(id: number, nom: string) {
    if (!confirm(`Supprimer "${nom}" ? Cette action est irréversible.`)) return;
    await api.delete(`/admin/produits/${id}/`);
    fetchProducts();
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Produits</h1>
        <Link
          to="/admin-dashboard/produits/nouveau"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Nom</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Catégorie</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Variantes</th>
              <th className="text-left px-4 py-3 font-medium text-gray-600">Stock</th>
              <th className="text-right px-4 py-3 font-medium text-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => {
              const stock = getStockTotal(product);
              return (
                <tr key={product.id} className="border-b border-gray-100 last:border-0">
                  <td className="px-4 py-3 font-medium">{product.nom}</td>
                  <td className="px-4 py-3 text-gray-500">{product.categorie}</td>
                  <td className="px-4 py-3 text-gray-500">
                    {product.variants?.length ?? 0}
                  </td>
                  <td className="px-4 py-3">
                    {stock === 0 ? (
                      <span className="text-red-600 font-medium">🔴 Rupture</span>
                    ) : stock <= 5 ? (
                      <span className="text-orange-600 font-medium">🟠 {stock}</span>
                    ) : (
                      <span className="text-green-600 font-medium">🟢 {stock}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end gap-3">
                      <Link
                        to={`/admin-dashboard/produits/${product.id}`}
                        className="text-gray-500 hover:text-black"
                      >
                        <Pencil size={16} />
                      </Link>
                      <button
                        onClick={() => handleDelete(product.id, product.nom)}
                        className="text-gray-500 hover:text-red-600"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}