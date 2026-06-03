export interface Product {
  id?: number;
  codigo: string;
  descricao: string;
  codigo_de_barras?: string;
  valor: string;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export const fetchProducts = async (search: string = ''): Promise<Product[]> => {
  const url = search ? `${API_URL}/products/?search=${encodeURIComponent(search)}` : `${API_URL}/products/`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error('Falha ao buscar produtos');
  }
  return response.json();
};

export const createProduct = async (product: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.codigo?.[0] || 'Falha ao criar produto');
  }
  return response.json();
};

export const updateProduct = async (id: number, product: Product): Promise<Product> => {
  const response = await fetch(`${API_URL}/products/${id}/`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(product),
  });
  if (!response.ok) {
    const err = await response.json();
    throw new Error(err.codigo?.[0] || 'Falha ao atualizar produto');
  }
  return response.json();
};

export const deleteProduct = async (id: number): Promise<void> => {
  const response = await fetch(`${API_URL}/products/${id}/`, {
    method: 'DELETE',
  });
  if (!response.ok) {
    throw new Error('Falha ao deletar produto');
  }
};
