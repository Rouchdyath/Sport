import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft } from "lucide-react";

export default function AdminEbookFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [fichierPdf, setFichierPdf] = useState<File | null>(null);
  const [pdfActuel, setPdfActuel] = useState("");
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/ebooks/${id}/`).then((res) => {
        const e = res.data;
        setNom(e.nom);
        setDescription(e.description);
        setPrix(e.prix);
        setImagePreview(e.image);
        setPdfActuel(e.fichier_pdf);
        setLoading(false);
      });
    }
  }, [id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("description", description);
      formData.append("prix", prix);
      if (image) formData.append("image", image);
      if (fichierPdf) formData.append("fichier_pdf", fichierPdf);

      if (isEdit) {
        await api.patch(`/admin/ebooks/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        if (!image || !fichierPdf) {
          alert("L'image de couverture et le fichier PDF sont obligatoires.");
          setSaving(false);
          return;
        }
        await api.post("/admin/ebooks/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      navigate("/admin-dashboard/ebooks");
    } catch (err: any) {
      alert("Erreur : " + JSON.stringify(err.response?.data ?? err.message));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/admin-dashboard/ebooks" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} />
        Retour aux e-books
      </Link>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? "Modifier l'e-book" : "Nouvel e-book"}</h1>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white border border-gray-200 rounded-xl p-6">
        <div>
          <label className="block text-sm font-medium mb-1">Nom</label>
          <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
          <input type="number" required value={prix} onChange={(e) => setPrix(e.target.value)}
            className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Image de couverture</label>
          {imagePreview && !image && <img src={imagePreview} alt="" className="w-20 h-24 object-cover mb-2 rounded" />}
          <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Fichier PDF</label>
          {pdfActuel && !fichierPdf && (
            <a href={pdfActuel} target="_blank" rel="noreferrer" className="text-xs text-primary underline block mb-2">
              Voir le PDF actuel
            </a>
          )}
          <input type="file" accept="application/pdf" onChange={(e) => setFichierPdf(e.target.files?.[0] ?? null)} />
        </div>

        <button type="submit" disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}