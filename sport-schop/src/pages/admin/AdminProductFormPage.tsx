import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import api from "../../api/axios";
import { ArrowLeft, Plus, Trash2 } from "lucide-react";

type VariantForm = {
  id?: number;
  couleur: string;
  qualite: string;
  prix: string;
  stock: string;
  image: File | null;
  imagePreview: string;
};

const categories = ["Football", "Musculation", "Running", "Fitness", "Boxe", "Accessoires"];

export default function AdminProductFormPage() {
  const { id } = useParams();
  const isEdit = !!id;
  const navigate = useNavigate();

  const [nom, setNom] = useState("");
  const [categorie, setCategorie] = useState(categories[0]);
  const [description, setDescription] = useState("");
  const [prixSimple, setPrixSimple] = useState("");
  const [stockSimple, setStockSimple] = useState("");
  const [imageSimple, setImageSimple] = useState<File | null>(null);
  const [variants, setVariants] = useState<VariantForm[]>([]);
  const [loading, setLoading] = useState(isEdit);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isEdit) {
      api.get(`/admin/produits/${id}/`).then((res) => {
        const p = res.data;
        setNom(p.nom);
        setCategorie(p.categorie);
        setDescription(p.description);
        setPrixSimple(p.prix ?? "");
        setStockSimple(p.stock ?? "");
        setVariants(
          p.variants.map((v: any) => ({
            id: v.id,
            couleur: v.couleur,
            qualite: v.qualite,
            prix: v.prix,
            stock: v.stock,
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

  async function removeVariant(index: number) {
    const variant = variants[index];
    if (variant.id) {
      if (!confirm("Supprimer cette variante ?")) return;
      await api.delete(`/admin/variants/${variant.id}/`);
    }
    setVariants(variants.filter((_, i) => i !== index));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    try {
      let productId = id;

      if (isEdit) {
        await api.patch(`/admin/produits/${id}/`, { nom, categorie, description });
      } else {
        const formData = new FormData();
        formData.append("nom", nom);
        formData.append("categorie", categorie);
        formData.append("description", description);
        if (variants.length === 0) {
          formData.append("prix", prixSimple);
          formData.append("stock", stockSimple);
          if (imageSimple) formData.append("image", imageSimple);
        }
        const res = await api.post("/admin/produits/", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        productId = res.data.id;
      }

      // Gérer les variantes (créer nouvelles, mettre à jour existantes)
      for (const variant of variants) {
        const variantFormData = new FormData();
        variantFormData.append("product", String(productId));
        variantFormData.append("couleur", variant.couleur);
        variantFormData.append("qualite", variant.qualite);
        variantFormData.append("prix", variant.prix);
        variantFormData.append("stock", variant.stock);
        if (variant.image) variantFormData.append("image", variant.image);

        if (variant.id) {
          await api.patch(`/admin/variants/${variant.id}/`, variantFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        } else {
          if (!variant.image) {
            alert(`Ajoute une image pour la variante "${variant.couleur}"`);
            continue;
          }
          await api.post("/admin/variants/", variantFormData, {
            headers: { "Content-Type": "multipart/form-data" },
          });
        }
      }

      navigate("/admin-dashboard/produits");
    } catch (err: any) {
      alert("Erreur lors de l'enregistrement : " + JSON.stringify(err.response?.data ?? err.message));
    } finally {
      setSaving(false);
    }
  }

  if (loading) return <div className="p-8 text-gray-500">Chargement...</div>;

  return (
    <div className="p-8 max-w-4xl">
      <Link to="/admin-dashboard/produits" className="flex items-center gap-2 text-sm text-gray-500 hover:text-primary mb-6">
        <ArrowLeft size={16} />
        Retour aux produits
      </Link>

      <h1 className="text-2xl font-bold mb-8">{isEdit ? "Modifier le produit" : "Nouveau produit"}</h1>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Infos générales */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-4">
          <h2 className="font-semibold">Informations générales</h2>

          <div>
            <label className="block text-sm font-medium mb-1">Nom</label>
            <input
              type="text" required value={nom} onChange={(e) => setNom(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Catégorie</label>
            <select
              value={categorie} onChange={(e) => setCategorie(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-primary"
            >
              {categories.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              required rows={3} value={description} onChange={(e) => setDescription(e.target.value)}
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black"
            />
          </div>

          {!isEdit && variants.length === 0 && (
            <>
              <p className="text-xs text-gray-500">
                Si ce produit n'a pas de couleurs/qualités différentes, remplis prix/stock/image ici.
                Sinon, ajoute des variantes plus bas et laisse ces champs vides.
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Prix (FCFA)</label>
                  <input type="number" value={prixSimple} onChange={(e) => setPrixSimple(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black" />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Stock</label>
                  <input type="number" value={stockSimple} onChange={(e) => setStockSimple(e.target.value)}
                    className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:border-black" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Image</label>
                <input type="file" accept="image/*" onChange={(e) => setImageSimple(e.target.files?.[0] ?? null)} />
              </div>
            </>
          )}
        </div>

        {/* Variantes */}
        <div className="bg-white border border-gray-200 rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold">Variantes (couleur / qualité)</h2>
            <button
              type="button"
              onClick={addVariant}
              className="flex items-center gap-2 text-sm text-black border border-gray-300 px-3 py-1.5 rounded hover:bg-gray-50"
            >
              <Plus size={14} />
              Ajouter une variante
            </button>
          </div>

          {variants.length === 0 ? (
            <p className="text-sm text-gray-400">Aucune variante. Ce produit est simple (prix/stock unique).</p>
          ) : (
            <div className="space-y-4">
              {variants.map((variant, index) => (
                <div key={variant.id ?? `new-${index}`} className="border border-gray-200 rounded p-4 grid grid-cols-6 gap-3 items-end">
                  <div>
                    <label className="block text-xs font-medium mb-1">Couleur</label>
                    <input
                      type="text" required value={variant.couleur}
                      onChange={(e) => updateVariant(index, "couleur", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Qualité</label>
                    <input
                      type="text" required value={variant.qualite}
                      onChange={(e) => updateVariant(index, "qualite", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Prix</label>
                    <input
                      type="number" required value={variant.prix}
                      onChange={(e) => updateVariant(index, "prix", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Stock</label>
                    <input
                      type="number" required value={variant.stock}
                      onChange={(e) => updateVariant(index, "stock", e.target.value)}
                      className="w-full border border-gray-300 px-2 py-1.5 rounded text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium mb-1">Image</label>
                    {variant.imagePreview && !variant.image && (
                      <img src={variant.imagePreview} alt="" className="w-10 h-10 object-cover mb-1" />
                    )}
                    <input
                      type="file" accept="image/*"
                      onChange={(e) => updateVariant(index, "image", e.target.files?.[0] ?? null)}
                      className="text-xs"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => removeVariant(index)}
                    className="text-gray-400 hover:text-red-600 justify-self-center"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          type="submit"
          disabled={saving}
          className="bg-primary text-white px-6 py-3 text-sm font-medium hover:bg-primary-dark transition disabled:opacity-50"
        >
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </form>
    </div>
  );
}