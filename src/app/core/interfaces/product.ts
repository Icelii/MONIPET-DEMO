export interface Product {
  id: number;
  name: string;
  price: number | string;
  stock: number;
  discount: number | string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  product_photos: { photo_link: string }[];
  categories: { category: string }[];
  categoryNames?: string[];
  photo_link?: string;
}
