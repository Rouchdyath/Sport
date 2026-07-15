import { Link } from "react-router-dom";
import type { Product } from "../types";
import { getDefaultDisplay, hasVariants } from "../utils/product";

export default function ProductCard({ product }: { product: Product }) {
  const { prix, image } = getDefaultDisplay(product);

  return (
    <Link to={`/produit/${product.id}`} className="group block bg-white">
      <div className="aspect-square overflow-hidden bg-gray-100">
        <img
          src={image ?? ""}
          alt={product.nom}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
      </div>
      <div className="mt-3 text-center">
        <h3 className="text-sm font-medium text-gray-800">{product.nom}</h3>
        <p className="text-sm text-gray-500 mt-1">
          {hasVariants(product) ? "À partir de " : ""}
          {prix.toLocaleString()} FCFA
        </p>
      </div>
    </Link>
  );
}