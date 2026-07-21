import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

const CATEGORIES = ["Football", "Musculation", "Running", "Fitness", "Boxe", "Accessoires"];

type VariantForm = {
  id?: number;
  couleur: string;
  qualite: string;
  prix: string;
  stock: string;
  image: File | null;
  imagePreview: string;
};

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState(CATEGORIES[0]);
  const [description, setDescription] = useState("");
  const [prix, setPrix] = useState("");
  const [stock, setStock] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [variantsSupprimes, setVariantsSupprimes] = useState<number[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/produits/${id}/`).then((res) => {
        const p = res.data;
        setNom(p.nom);
        setCategorie(p.categorie);
        setDescription(p.description);
        setPrix(p.prix ?? "");
        setStock(p.stock ?? "");
        setImagePreview(p.image ?? "");
        setVariants(
          (p.variants ?? []).map((v: any) => ({
            id: v.id,
            couleur: v.couleur,
            qualite: v.qualite,
            prix: String(v.prix),
            stock: String(v.stock),
            image: null,
            imagePreview: v.image,
          }))
        );
        setLoading(false);
      });
    }
  }, [id]);

  function addVariant() {
    setVariants([...variants, { couleur: "", qualite: "", prix: "", stock: "", image: null, imagePreview: "" }]);
  }

  function updateVariant(index: number, field: keyof VariantForm, value: any) {
    const updated = [...variants];
    (updated[index] as any)[field] = value;
    setVariants(updated);
  }

  function removeVariant(index: number) {
    const variant = variants[index];
    if (variant.id) setVariantsSupprimes([...variantsSupprimes, variant.id]);
    setVariants(variants.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      const formData = new FormData();
      formData.append("nom", nom);
      formData.append("categorie", categorie);
      formData.append("description", description);
      if (prix) formData.append("prix", prix);
      formData.append("stock", stock || "0");
      if (image) formData.append("image", image);

      let productId = id;

      if (isEdit) {
        await api.patch(`/admin/produits/${id}/`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      } else {
        const res = await api.post("/admin/produits/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        productId = res.data.id;
      }

      for (const del of variantsSupprimes) {
        await api.delete(`/admin/variants/${del}/`);
      }

      for (const variant of variants) {
        const vData = new FormData();
        vData.append("product", String(productId));
        vData.append("couleur", variant.couleur);
        vData.append("qualite", variant.qualite);
        vData.append("prix", variant.prix);
        vData.append("stock", variant.stock);
        if (variant.image) vData.append("image", variant.image);

        if (variant.id) {
          await api.patch(`/admin/variants/${variant.id}/`, vData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          await api.post("/admin/variants/", vData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      navigate("/admin-dashboard/produits");
    } catch (err: any) {
      alert("Erreur : " + JSON.stringify(err.response?.data ?? err.message));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-3xl">
      <Link to="/admin-dashboard/produits" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} />
        Retour aux produits
      </Link>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
          <h2 className="font-semibold">Informations générales</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select value={categorie} onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Prix (FCFA) — si sans variantes</label>
              <input type="number" value={prix} onChange={(e) => setPrix(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Stock — si sans variantes</label>
              <input type="number" value={stock} onChange={(e) => setStock(e.target.value)}
                className="w-full border border-gray-300 px-4 py-2 rounded-lg focus:outline-none focus:border-primary" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Image principale</label>
            {imagePreview && !image && <img src={imagePreview} alt="" className="w-20 h-20 object-cover mb-2 rounded" />}
            <input type="file" accept="image/*" onChange={(e) => setImage(e.target.files?.[0] ?? null)} />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Variantes (couleur / qualité)</h2>
            <button type="button" onClick={addVariant}
              className="flex items-center gap-2 text-sm text-primary border border-gray-300 px-3 py-1.5 rounded-lg hover:bg-gray-50">
              <Plus size={14} /> Ajouter une variante
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune variante — le produit utilisera le prix/stock ci-dessus.</p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id ?? `new-${index}`} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-start gap-3">
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <input type="text" required placeholder="Couleur" value={variant.couleur}
                        onChange={(e) => updateVariant(index, "couleur", e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm" />
                      <input type="text" required placeholder="Qualité" value={variant.qualite}
                        onChange={(e) => updateVariant(index, "qualite", e.target.value)}
                        className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm" />
                    </div>
                    <button type="button" onClick={() => removeVariant(index)} className="text-gray-400 hover:text-red-600 mt-1">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <input type="number" required placeholder="Prix (FCFA)" value={variant.prix}
                      onChange={(e) => updateVariant(index, "prix", e.target.value)}
                      className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm" />
                    <input type="number" required placeholder="Stock" value={variant.stock}
                      onChange={(e) => updateVariant(index, "stock", e.target.value)}
                      className="border border-gray-300 px-3 py-1.5 rounded-lg text-sm" />
                  </div>
                  <div>
                    {variant.imagePreview && !variant.image && (
                      <img src={variant.imagePreview} alt="" className="w-12 h-12 object-cover mb-1 rounded" />
                    )}
                    <input type="file" accept="image/*"
                      onChange={(e) => updateVariant(index, "image", e.target.files?.[0] ?? null)} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <button type="submit" disabled={saving}
          className="bg-primary text-white px-6 py-3 rounded-lg text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50">
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}