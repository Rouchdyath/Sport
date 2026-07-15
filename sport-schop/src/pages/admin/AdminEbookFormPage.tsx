import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type ContenuForm = {
  id?: number;
  titre: string;
  description: string;
  ordre: number;
};

type DocumentForm = {
  id?: number;
  fichier?: File | null;
  fichierUrl?: string;
  titre: string;
  niveau: string;
};

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
  const [documents, setDocuments] = useState<DocumentForm[]>([]);
  const [contenu, setContenu] = useState<ContenuForm[]>([]);
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
        setContenu(e.contenu ?? []);
        setDocuments((e.documents ?? []).map((d: any) => ({ id: d.id, fichierUrl: d.fichier_pdf, titre: d.titre || "", niveau: d.niveau || "" })));
        setLoading(false);
      });
    }
  }, [id]);

  function addContenuItem() {
    setContenu([...contenu, { titre: "", description: "", ordre: contenu.length }]);
  }

  function updateContenuItem(index: number, field: keyof ContenuForm, value: any) {
    const updated = [...contenu];
    (updated[index] as any)[field] = value;
    setContenu(updated);
  }

  function addDocument() {
    if (documents.length >= 5) return alert("Maximum 5 documents autorisés.");
    setDocuments([...documents, { fichier: null, titre: "", niveau: "" }]);
  }

  function updateDocument(index: number, field: keyof DocumentForm, value: any) {
    const updated = [...documents];
    (updated[index] as any)[field] = value;
    setDocuments(updated);
  }

  async function removeDocument(index: number) {
    const doc = documents[index];
    if (doc.id) {
      await api.delete(`/admin/ebook-documents/${doc.id}/`);
    }
    setDocuments(documents.filter((_, i) => i !== index));
  }

  function handleDocumentFileChange(index: number, file: File | null) {
    if (!file) return updateDocument(index, "fichier", null);
    if (!file.name.toLowerCase().endsWith(".pdf")) {
      alert("Seul le format PDF est autorisé.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("Le fichier PDF ne doit pas dépasser 5 Mo.");
      return;
    }
    updateDocument(index, "fichier", file);
  }

  async function removeContenuItem(index: number) {
    const item = contenu[index];
    if (item.id) {
      await api.delete(`/admin/contenu-ebooks/${item.id}/`);
    }
    setContenu(contenu.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let ebookId = id;

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
        const res = await api.post("/admin/ebooks/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        ebookId = res.data.id;
      }
        // upload new/changed documents (max 5, validated on selection)
        for (const d of documents) {
          if (d.fichier) {
            const docForm = new FormData();
            docForm.append("ebook", String(ebookId));
            docForm.append("fichier_pdf", d.fichier);
            if (d.titre) docForm.append("titre", d.titre);
            if (d.niveau) docForm.append("niveau", d.niveau);
            await api.post("/admin/ebook-documents/", docForm, {
              headers: { "Content-Type": "multipart/form-data" },
            });
          }
        }

      for (const item of contenu) {
        if (item.id) {
          await api.patch(`/admin/contenu-ebooks/${item.id}/`, {
            titre: item.titre, description: item.description, ordre: item.ordre,
          });
        } else {
          await api.post("/admin/contenu-ebooks/", {
            ebook: ebookId, titre: item.titre, description: item.description, ordre: item.ordre,
          });
        }
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

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Informations générales</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
            <input type="number" required value={prix} onChange={(e) => setPrix(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image de couverture</label>
            {imagePreview && !image && <img src={imagePreview} alt="" className="w-20 h-24 object-cover mb-2" />}
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

          <div className="mt-4">
            <h3 className="text-sm font-medium mb-2">Documents de formation (max 5)</h3>
            {documents.length === 0 && <p className="text-sm text-gray-400 mb-2">Aucun document ajouté.</p>}
            <div className="space-y-3">
              {documents.map((doc, idx) => (
                <div key={doc.id ?? `doc-${idx}`} className="border border-gray-200 rounded p-3 flex gap-3 items-start">
                  <div className="flex-1">
                    <input
                      type="text"
                      placeholder="Titre (optionnel)"
                      value={doc.titre}
                      onChange={(e) => updateDocument(idx, "titre", e.target.value)}
                      className="w-full border border-gray-300 px-3 py-1.5 rounded mb-2 text-sm"
                    />
                    <select value={doc.niveau} onChange={(e) => updateDocument(idx, "niveau", e.target.value)} className="w-full border border-gray-300 px-3 py-1.5 rounded mb-2 text-sm">
                      <option value="">Sélectionner le niveau (optionnel)</option>
                      <option value="Niveau 1">Niveau 1</option>
                      <option value="Niveau 2">Niveau 2</option>
                      <option value="Niveau 3">Niveau 3</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <div className="text-sm text-gray-600">{doc.fichierUrl ? <a href={doc.fichierUrl} target="_blank" rel="noreferrer" className="underline text-primary">Voir</a> : null}</div>
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <input type="file" accept="application/pdf" onChange={(e) => handleDocumentFileChange(idx, e.target.files?.[0] ?? null)} />
                    <button type="button" onClick={() => removeDocument(idx)} className="text-red-600 text-sm">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <button type="button" onClick={addDocument} className="text-sm text-primary border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
                <Plus size={14} /> Ajouter un document
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Contenu détaillé</h2>
            <button type="button" onClick={addContenuItem}
              className="flex items-center gap-2 text-sm text-primary border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50">
              <Plus size={14} />
              Ajouter un point
            </button>
          </div>

          {contenu.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun contenu détaillé pour l'instant.</p>
          ) : (
            <div className="space-y-4">
              {contenu.map((item, index) => (
                <div key={item.id ?? `new-${index}`} className="border border-gray-200 rounded p-4 space-y-2">
                  <div className="flex justify-between items-start gap-3">
                    <input
                      type="text" required placeholder="Titre" value={item.titre}
                      onChange={(e) => updateContenuItem(index, "titre", e.target.value)}
                      className="flex-1 border border-gray-300 px-3 py-1.5 rounded text-sm font-medium"
                    />
                    <button type="button" onClick={() => removeContenuItem(index)} className="text-gray-400 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <textarea
                    required rows={2} placeholder="Description" value={item.description}
                    onChange={(e) => updateContenuItem(index, "description", e.target.value)}
                    className="w-full border border-gray-300 px-3 py-1.5 rounded text-sm"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}