import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import type { Product } from "../types";
import ProductCard from "../components/ProductCard";

const categories = ["Tous", "Football", "Musculation", "Running", "Fitness", "Boxe", "Accessoires"];

export default function ShopPage() {
  const [searchParams] = useSearchParams();
  const categorieFromUrl = searchParams.get("categorie");

  const [activeCategory, setActiveCategory] = useState(
    categories.includes(categorieFromUrl ?? "") ? categorieFromUrl! : "Tous"
  );
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/produits/").then((res) => {
      setProducts(res.data);
      setLoading(false);
    });
  }, []);

  useEffect(() => {
    if (categorieFromUrl && categories.includes(categorieFromUrl)) {
      setActiveCategory(categorieFromUrl);
    }
  }, [categorieFromUrl]);

  const filteredProducts =
    activeCategory === "Tous"
      ? products
      : products.filter((p) => p.categorie === activeCategory);

  if (loading) {
    return <div className="text-center py-20 text-gray-500">Chargement...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="text-2xl font-bold mb-8 text-center">Nos Produits</h1>

      <div className="flex flex-wrap justify-center gap-3 mb-10">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm border transition ${
              activeCategory === cat
                ? "bg-primary text-white border-primary"
                : "border-gray-300 text-gray-600 hover:border-primary"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}