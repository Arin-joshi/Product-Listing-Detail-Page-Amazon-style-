import { apiClient } from './client';
import { Product, ProductsResponse, Category } from '../types';

export const fetchProducts = async (params?: Record<string, string | number>) => {
  let endpoint = '/products?limit=0';
  if (params?.category && params.category !== 'all') {
    endpoint = `/products/category/${params.category}?limit=0`;
  }
  if (params?.q) {
    endpoint = `/products/search?q=${params.q}&limit=0`;
  }

  const data = await apiClient<ProductsResponse>(endpoint);
  return data;
};

export const fetchProductById = async (id: string | number) => {
  return apiClient<Product>(`/products/${id}`);
};

export const fetchCategories = async () => {
  const data = await apiClient<Category[] | string[]>('/products/categories');
  if (data.length > 0 && typeof data[0] === 'string') {
    return (data as string[]).map((c: string) => ({
      slug: c,
      name: c.charAt(0).toUpperCase() + c.slice(1).replace('-', ' '),
      url: ''
    }));
  }
  return data as Category[];
};
