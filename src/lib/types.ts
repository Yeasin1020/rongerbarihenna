export type Product = {
  id: number;
  name: string;
  slug: string;
  shortDesc?: string | null;
  description?: string | null;
  price: number;
  salePrice?: number | null;
  stock: number;
  sku?: string | null;
  images: string[];
  isActive: boolean;
  isFeatured: boolean;
  freeDelivery?: boolean;
  sortOrder: number;
  metaTitle?: string | null;
  metaDesc?: string | null;
  updatedAt?: string;
};

export type ComboItem = {
  id: number;
  productId: number;
  quantity: number;
  product: Pick<Product, 'id' | 'name' | 'slug' | 'images' | 'price' | 'salePrice'>;
};

export type Combo = {
  id: number;
  name: string;
  slug: string;
  description?: string | null;
  image?: string | null;
  price: number;
  regularPrice?: number | null;
  isActive: boolean;
  freeDelivery?: boolean;
  sortOrder: number;
  items: ComboItem[];
};

// Settings onek boro JSON — admin panel theke edit hoy
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Settings = Record<string, any>;
