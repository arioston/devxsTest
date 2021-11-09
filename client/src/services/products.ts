import api from "./api";

export interface Product {
  id: number | string;
  name: string;
  description: string;
  price: number;
  publishedAt: Date;
  images?: { imageId: number }[];
}

export const createProductsRequest = async (data: Product) => {
  const product = await api.post<Product>("/products", data);
  return product;
};

export const updatecreateProductsRequest = async (data: Partial<Product>) => {
  const product = await api.patch<Product>(`/products/${data.id}`, data);
  return product;
};

export const fetchProductRequest = async (id: number) => {
  const product = await api.get<Product>(`/products/${id}`);
  return product;
};

export const fetchProductsRequest = async () => {
  const product = await api.get<Product[]>(`/products`);
  return product;
};

export const deleteProductRequest = async (id: number) => {
  const product = await api.delete<Product>(`/products/${id}`);
  return product;
};
