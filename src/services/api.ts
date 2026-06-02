import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

export interface LabelData {
  model?: string;
  product_name: string;
  code: string;
  barcode: string;
  price: string;
  copies: number;
}

export async function generateTspl(data: LabelData): Promise<any> {
  const response = await axios.post(`${API_URL}/generate-tspl/`, data);
  return response.data.tspl;
}
