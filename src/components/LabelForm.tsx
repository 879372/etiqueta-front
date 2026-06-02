import type { LabelData } from '../services/api';

interface Props {
  data: LabelData;
  onChange: (data: Partial<LabelData>) => void;
  onPrint: () => void;
  loading: boolean;
}

export function LabelForm({ data, onChange, onPrint, loading }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPrint();
  };

  return (
    <form className="label-form" onSubmit={handleSubmit}>
      <div className="form-group">
        <label>Modelo de Etiqueta</label>
        <select
          value={data.model || 'large'}
          onChange={e => onChange({ model: e.target.value })}
        >
          <option value="small_3">Etiqueta Argox 90x15 (3 Colunas)</option>
          <option value="large">Padrão 100x60mm</option>
        </select>
      </div>

      <div className="field">
        <label>Nome do Produto</label>
        <input
          type="text"
          value={data.product_name}
          onChange={e => onChange({ product_name: e.target.value })}
          placeholder="Ex: ACHOCOLATADO PO DOIS FRADES"
        />
      </div>

      <div className="field">
        <label>Código (COD)</label>
        <input
          type="text"
          value={data.code}
          onChange={e => onChange({ code: e.target.value })}
          placeholder="Ex: 309411"
        />
      </div>

      <div className="field">
        <label>Código de Barras (EAN-13)</label>
        <input
          type="text"
          value={data.barcode}
          onChange={e => onChange({ barcode: e.target.value })}
          placeholder="Ex: 7891027309411"
          maxLength={13}
        />
      </div>

      <div className="field">
        <label>Preço (R$)</label>
        <input
          type="text"
          value={data.price}
          onChange={e => onChange({ price: e.target.value })}
          placeholder="Ex: 44,38"
        />
      </div>

      <div className="field">
        <label>{data.model === 'small_3' ? 'Qtd de Linhas (3 etiquetas por linha)' : 'Quantidade de Cópias'}</label>
        <input
          type="number"
          min={1}
          max={999}
          value={data.copies}
          onChange={e => onChange({ copies: parseInt(e.target.value) || 1 })}
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? 'Enviando...' : '🖨️ Imprimir'}
      </button>
    </form>
  );
}
