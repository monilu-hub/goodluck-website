import { COLLECTIONS, PRODUCTS } from "../../../data/catalog";
import type { Collection, Product } from "@/types";

export type CatalogFilters = {
  collection?: string;
  type?: string;
  color?: string;
  gender?: string;
  q?: string;
  page?: number;
  pageSize?: number;
};

export function getCollections(): Collection[] {
  return [...COLLECTIONS].sort((a, b) => a.sortOrder - b.sortOrder);
}

export function getCollectionBySlug(slug: string): Collection | undefined {
  return COLLECTIONS.find((c) => c.slug === slug);
}

export function getAllProducts(): Product[] {
  return PRODUCTS;
}

export function getProductBySlug(slug: string): Product | undefined {
  return PRODUCTS.find((p) => p.slug === slug);
}

export function getFeaturedProducts(): Product[] {
  return PRODUCTS.filter((p) => p.featured);
}

export function getCustomizableProducts(): Product[] {
  return PRODUCTS.filter((p) => p.isCustomizable);
}

export function filterProducts(filters: CatalogFilters = {}) {
  const page = filters.page ?? 1;
  const pageSize = filters.pageSize ?? 12;

  let items = [...PRODUCTS];

  if (filters.collection) {
    items = items.filter((p) => p.collectionSlug === filters.collection);
  }
  if (filters.type) {
    items = items.filter((p) => p.type === filters.type);
  }
  if (filters.color) {
    items = items.filter((p) =>
      p.colors.some((c) => c.toLowerCase() === filters.color!.toLowerCase()),
    );
  }
  if (filters.gender) {
    items = items.filter(
      (p) => p.gender === filters.gender || p.gender === "unisex",
    );
  }
  if (filters.q) {
    const q = filters.q.toLowerCase();
    items = items.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q),
    );
  }

  const total = items.length;
  const start = (page - 1) * pageSize;
  const pageItems = items.slice(start, start + pageSize);

  return {
    items: pageItems,
    total,
    page,
    pageSize,
    totalPages: Math.max(1, Math.ceil(total / pageSize)),
  };
}
