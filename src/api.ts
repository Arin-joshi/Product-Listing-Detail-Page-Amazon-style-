import { Product, Category } from './types';

const BASE_URL = 'https://dummyjson.com/products';

export async function fetchCategories(): Promise<Category[]> {
  const res = await fetch(`${BASE_URL}/categories`);
  if (!res.ok) throw new Error('Failed to fetch categories');
  const data = await res.json();
  
  // Handle both array of strings and array of objects for backward compatibility
  if (data.length > 0 && typeof data[0] === 'string') {
    return data.map((c: string) => ({ slug: c, name: c, url: '' }));
  }
  return data;
}

export async function fetchProducts(category?: string | null): Promise<Product[]> {
  const url = category && category !== 'all' 
    ? `${BASE_URL}/category/${category}?limit=0` 
    : `${BASE_URL}?limit=0`;
  
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch products');
  const data = await res.json();
  return data.products || [];
}

export async function fetchProductById(id: string): Promise<Product> {
  const res = await fetch(`${BASE_URL}/${id}`);
  if (!res.ok) throw new Error('Failed to fetch product');
  return res.json();
}
