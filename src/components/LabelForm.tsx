import type { LabelData } from '../services/api';
import { formatCurrency, handleCurrencyMask } from '../utils/format';

interface Props {
  data: LabelData;
  onChange: (data: Partial<LabelData>) => void;
  onPreview: () => void;
}

export function LabelForm({ data, onChange, onPreview }: Props) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onPreview();
  };

  return (
    <div className="card">
      <h2>📝 Dados da Etiqueta</h2>
      <form className="label-form" onSubmit={handleSubmit}>
        <div className="field">
          <label>Modelo de Etiqueta</label>
          <div className="select-wrapper">
            <select
              value={data.model || 'medium_115x35'}
              onChange={e => onChange({ model: e.target.value })}
            >
              <option value="small_3">Etiqueta Argox 90x15 (3 Colunas)</option>
              <option value="medium_115x35">Etiqueta Argox 115x35mm</option>
            </select>
          </div>
        </div>

        <div className="field">
          <label>Nome do Produto</label>
          <input
            type="text"
            value={data.product_name}
            onChange={e => onChange({ product_name: e.target.value })}
            placeholder="Ex: ACHOCOLATADO PO DOIS FRADES"
            required
          />
        </div>

        <div className="field">
          <label>Código (COD)</label>
          <input
            type="text"
            value={data.code}
            onChange={e => onChange({ code: e.target.value })}
            placeholder="Ex: 309411"
            required
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
            value={data.price ? formatCurrency(data.price) : ''}
            onChange={e => handleCurrencyMask(e, (val) => onChange({ price: val }))}
            placeholder="Ex: R$ 44,38"
            required
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
            required
          />
        </div>

        <button type="submit" className="btn-primary" style={{ marginTop: '1rem' }}>
          Visualizar Etiqueta
        </button>
      </form>
    </div>
  );
}
