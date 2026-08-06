"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartItem } from "@/types";
import {
  CUSTOMIZATION_FEE_COP,
  FREE_SHIPPING_THRESHOLD,
  SHIPPING_COP,
} from "../../data/catalog";

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "id" | "quantity"> & { quantity?: number }) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clear: () => void;
  subtotal: () => number;
  shipping: () => number;
  total: () => number;
  count: () => number;
};

function lineTotal(item: CartItem) {
  const fee = item.customizationFeeCop ?? 0;
  return (item.priceCop + fee) * item.quantity;
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item) => {
        const quantity = item.quantity ?? 1;
        set((state) => {
          const existing = state.items.find(
            (i) =>
              i.variantId === item.variantId &&
              i.customDesignId === item.customDesignId,
          );
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === existing.id
                  ? { ...i, quantity: i.quantity + quantity }
                  : i,
              ),
            };
          }
          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity,
                id: `${item.variantId}-${item.customDesignId ?? "std"}-${Date.now()}`,
                customizationFeeCop: item.customDesignId
                  ? (item.customizationFeeCop ?? CUSTOMIZATION_FEE_COP)
                  : 0,
              },
            ],
          };
        });
      },
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQuantity: (id, quantity) =>
        set((state) => ({
          items:
            quantity <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity } : i)),
        })),
      clear: () => set({ items: [] }),
      subtotal: () => get().items.reduce((sum, i) => sum + lineTotal(i), 0),
      shipping: () => {
        const sub = get().subtotal();
        if (sub === 0) return 0;
        return sub >= FREE_SHIPPING_THRESHOLD ? 0 : SHIPPING_COP;
      },
      total: () => get().subtotal() + get().shipping(),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: "goodluck-cart" },
  ),
);
