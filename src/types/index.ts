export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  rating: number;
  brand?: string;
  category: string;
  thumbnail: string;
  images: string[];
  discountPercentage?: number;
  stock?: number;
  availabilityStatus?: string;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  skip: number;
  limit: number;
}

export interface Category {
  slug: string;
  name: string;
  url: string;
}
