import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Plus, MoreVertical, Pencil, Trash2 } from "lucide-react";
import type { Ebook } from "../../types";

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);
  const [menuOuvert, setMenuOuvert] = useState<number | null>(null);

  useEffect(() => {
    fetchEbooks();
  }, []);

  function fetchEbooks() {
    api.get("/admin/ebooks/").then((res) => {
      setEbooks(res.data);
      setLoading(false);
    });
  }

  async function handleDelete(id: number, nom: string) {
    if (!confirm(`Supprimer "${nom}" ? Cette action est irréversible.`)) return;
    await api.delete(`/admin/ebooks/${id}/`);
    fetchEbooks();
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-bold text-[#14231F]">E-books</h1>
        <Link
          to="/admin-dashboard/ebooks/nouveau"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2.5 rounded-lg text-sm font-medium hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          Nouvel e-book
        </Link>
      </div>
      <p className="text-sm text-gray-500 mb-8">Total : {ebooks.length} guides publiés</p>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {ebooks.map((ebook) => (
          <div
            key={ebook.id}
            className="bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition relative"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-14 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                <img src={ebook.image} alt={ebook.nom} className="w-full h-full object-cover" />
              </div>
              <div className="relative">
                <button
                  onClick={() => setMenuOuvert(menuOuvert === ebook.id ? null : ebook.id)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <MoreVertical size={18} />
                </button>
                {menuOuvert === ebook.id && (
                  <div className="absolute right-0 top-6 bg-white border border-gray-200 rounded-lg shadow-lg py-1 w-36 z-10">
                    <Link
                      to={`/admin-dashboard/ebooks/${ebook.id}`}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Pencil size={14} /> Modifier
                    </Link>
                    <button
                      onClick={() => handleDelete(ebook.id, ebook.nom)}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50 w-full"
                    >
                      <Trash2 size={14} /> Supprimer
                    </button>
                  </div>
                )}
              </div>
            </div>
            <p className="font-semibold text-sm text-[#14231F] truncate">{ebook.nom}</p>
            <p className="text-xs text-gray-500 mt-1">{ebook.prix.toLocaleString()} FCFA</p>
          </div>
        ))}
      </div>
    </div>
  );
}