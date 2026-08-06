export type Gender = "hombre" | "mujer" | "unisex";
export type ProductType =
  | "camiseta-algodon"
  | "oversized"
  | "crop-top"
  | "tela-fria";

export type OrderStatus =
  | "draft"
  | "pending_payment"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled";

export type PaymentProvider =
  | "stripe"
  | "wompi"
  | "mercadopago"
  | "cod"
  | "transfer";

export type PaymentStatus =
  | "pending"
  | "processing"
  | "succeeded"
  | "failed"
  | "cancelled";

export interface Collection {
  id: string;
  slug: string;
  name: string;
  description: string;
  heroImage: string;
  sortOrder: number;
}

export interface ProductImage {
  url: string;
  alt: string;
  view: "front" | "back";
  color?: string;
}

export interface ProductVariant {
  id: string;
  sku: string;
  color: string;
  colorHex: string;
  size: string;
  priceCop: number;
  stock: number;
  imageUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  description: string;
  collectionId: string;
  collectionSlug: string;
  type: ProductType;
  gender: Gender;
  basePriceCop: number;
  isCustomizable: boolean;
  colors: string[];
  sizes: string[];
  images: ProductImage[];
  variants: ProductVariant[];
  featured?: boolean;
}

export interface CartItem {
  id: string;
  productId: string;
  productSlug: string;
  productName: string;
  variantId: string;
  color: string;
  size: string;
  priceCop: number;
  quantity: number;
  imageUrl: string;
  customDesignId?: string;
  customDesignPreview?: string;
  customizationFeeCop?: number;
}

export interface ShippingAddress {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  department: string;
  postalCode?: string;
  notes?: string;
}

export interface Order {
  id: string;
  status: OrderStatus;
  paymentProvider: PaymentProvider;
  subtotalCop: number;
  shippingCop: number;
  totalCop: number;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  createdAt: string;
}

export interface CustomDesign {
  id: string;
  productId: string;
  productSlug: string;
  color: string;
  size: string;
  canvasJson: string;
  previewUrl: string;
  userId?: string;
  guestEmail?: string;
  createdAt: string;
}

export interface PaymentSession {
  provider: PaymentProvider;
  redirectUrl?: string;
  externalId?: string;
  clientSecret?: string;
  publicKey?: string;
  orderId: string;
}

export interface PaymentResult {
  orderId: string;
  status: PaymentStatus;
  externalId?: string;
  provider: PaymentProvider;
}
