import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { Plus, Pencil, Trash2 } from "lucide-react";
import type { Ebook } from "../../types";

export default function AdminEbooksPage() {
  const [ebooks, setEbooks] = useState<Ebook[]>([]);
  const [loading, setLoading] = useState(true);

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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">E-books</h1>
        <Link
          to="/admin-dashboard/ebooks/nouveau"
          className="flex items-center gap-2 bg-primary text-white px-4 py-2 text-sm hover:bg-primary-dark transition"
        >
          <Plus size={16} />
          Nouvel e-book
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
        {ebooks.map((ebook) => (
          <div key={ebook.id} className="bg-white border border-gray-200 rounded-lg overflow-hidden">
            <div className="aspect-[3/4] bg-gray-100">
              <img src={ebook.image} alt={ebook.nom} className="w-full h-full object-cover" />
            </div>
            <div className="p-3">
              <h3 className="text-sm font-medium truncate">{ebook.nom}</h3>
              <p className="text-sm text-gray-500 mt-1">{ebook.prix.toLocaleString()} FCFA</p>
              <div className="flex justify-end gap-3 mt-2">
                <Link to={`/admin-dashboard/ebooks/${ebook.id}`} className="text-gray-500 hover:text-primary">
                  <Pencil size={16} />
                </Link>
                <button onClick={() => handleDelete(ebook.id, ebook.nom)} className="text-gray-500 hover:text-red-600">
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}