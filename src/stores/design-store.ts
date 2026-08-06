"use client";

import { create } from "zustand";

type DesignState = {
  productSlug: string | null;
  color: string | null;
  size: string;
  view: "front" | "back";
  history: string[];
  historyIndex: number;
  setProduct: (slug: string) => void;
  setColor: (color: string) => void;
  setSize: (size: string) => void;
  setView: (view: "front" | "back") => void;
  pushHistory: (json: string) => void;
  undo: () => string | null;
  redo: () => string | null;
  reset: () => void;
};

export const useDesignStore = create<DesignState>((set, get) => ({
  productSlug: null,
  color: null,
  size: "M",
  view: "front",
  history: [],
  historyIndex: -1,
  setProduct: (slug) => set({ productSlug: slug }),
  setColor: (color) => set({ color }),
  setSize: (size) => set({ size }),
  setView: (view) => set({ view }),
  pushHistory: (json) =>
    set((state) => {
      const history = state.history.slice(0, state.historyIndex + 1);
      history.push(json);
      return { history, historyIndex: history.length - 1 };
    }),
  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return null;
    const next = historyIndex - 1;
    set({ historyIndex: next });
    return history[next] ?? null;
  },
  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return null;
    const next = historyIndex + 1;
    set({ historyIndex: next });
    return history[next] ?? null;
  },
  reset: () =>
    set({
      history: [],
      historyIndex: -1,
      view: "front",
    }),
}));
