import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import type { Product, Variant, Ebook } from "../types";

export type CartItem = {
  product: Product | Ebook;
  variant: Variant | null;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  addToCart: (product: Product | Ebook, variant: Variant | null) => void;
  removeFromCart: (key: string) => void;
  updateQuantity: (key: string, quantity: number) => void;
   clearCart: () => void;
  total: number;
 
  
}


const CartContext = createContext<CartContextType | undefined>(undefined);

function getItemKey(product: Product | Ebook, variant: Variant | null) {
  return variant ? `variant-${variant.id}` : `product-${product.id}`;
}

function getAvailableStock(product: Product | Ebook, variant: Variant | null) {
  if (variant) return variant.stock;
  if ("stock" in product) return product.stock;
  return Infinity;
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  function addToCart(product: Product | Ebook, variant: Variant | null) {
    const key = getItemKey(product, variant);
    const available = getAvailableStock(product, variant);
    setItems((prev) => {
      const existing = prev.find((item) => getItemKey(item.product, item.variant) === key);
      const newQuantity = existing ? existing.quantity + 1 : 1;
      if (newQuantity > available) {
        alert(`Stock disponible : ${available}. La quantité demandée est supérieure à notre stock.`);
        return prev;
      }

      if (existing) {
        return prev.map((item) =>
          getItemKey(item.product, item.variant) === key
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, variant, quantity: 1 }];
    });
  }

  function removeFromCart(key: string) {
    setItems((prev) => prev.filter((item) => getItemKey(item.product, item.variant) !== key));
  }

  function updateQuantity(key: string, quantity: number) {
    if (quantity < 1) return;

    setItems((prev) =>
      prev.map((item) => {
        if (getItemKey(item.product, item.variant) !== key) return item;

        const available = getAvailableStock(item.product, item.variant);
        if (available === 0) {
          alert("Stock disponible : 0. Ce produit est en rupture de stock.");
          return item;
        }

        if (quantity > available) {
          alert(`Stock disponible : ${available}. La quantité demandée est supérieure à notre stock.`);
          return { ...item, quantity: available };
        }

        return { ...item, quantity };
      })
    );
  }

  function clearCart() {
    setItems([]);
  }

  const total = items.reduce((sum, item) => {
    const prix = item.variant ? item.variant.prix : (item.product as any).prix ?? 0;
    return sum + prix * item.quantity;
  }, 0);

  return (
    <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQuantity, clearCart, total }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart doit être utilisé dans un CartProvider");
  return context;
}