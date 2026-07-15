import type { Product } from "../types";

export function getDefaultDisplay(product: Product): { prix: number; image: string | null } {
  if (product.variants && product.variants.length > 0) {
    return { prix: product.variants[0].prix, image: product.variants[0].image };
  }
  return { prix: product.prix ?? 0, image: product.image };
}

export function hasVariants(product: Product): boolean {
  return !!product.variants && product.variants.length > 0;
}