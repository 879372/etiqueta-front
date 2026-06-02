import { useState } from 'react';
import type { LabelData } from '../services/api';

interface Props {
  onChange: (data: LabelData) => void;
  onPrint: () => void;
  loading: boolean;
}

export function LabelForm({ onChange, onPrint, loading }: Props) {
  const [form, setForm] = useState<LabelData>({
    product_name: '',
    code: '',
    barcode: '',
    price: '',
    copies: 1,
  });

  const handleChange = (field: keyof LabelData, value: string | number) => {
    const updated = { ...form, [field]: value };
    setForm(updated);
    onChange(updated);
  };

  return (
    <div className="label-form">
      <div className="field">
        <label>Nome do Produto</label>
        <input
          type="text"
          value={form.product_name}
          onChange={e => handleChange('product_name', e.target.value)}
          placeholder="Ex: ACHOCOLATADO PO DOIS FRADES"
        />
      </div>

      <div className="field">
        <label>Código (COD)</label>
        <input
          type="text"
          value={form.code}
          onChange={e => handleChange('code', e.target.value)}
          placeholder="Ex: 309411"
        />
      </div>

      <div className="field">
        <label>Código de Barras (EAN-13)</label>
        <input
          type="text"
          value={form.barcode}
          onChange={e => handleChange('barcode', e.target.value)}
          placeholder="Ex: 7891027309411"
          maxLength={13}
        />
      </div>

      <div className="field">
        <label>Preço (R$)</label>
        <input
          type="text"
          value={form.price}
          onChange={e => handleChange('price', e.target.value)}
          placeholder="Ex: 44,38"
        />
      </div>

      <div className="field">
        <label>Quantidade de Cópias</label>
        <input
          type="number"
          min={1}
          max={999}
          value={form.copies}
          onChange={e => handleChange('copies', parseInt(e.target.value) || 1)}
        />
      </div>

      <button onClick={onPrint} disabled={loading}>
        {loading ? 'Enviando...' : '🖨️ Imprimir'}
      </button>
    </div>
  );
}
