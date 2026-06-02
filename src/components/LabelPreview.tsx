import type { LabelData } from '../services/api';

interface Props {
  data: LabelData;
}

// Preview visual proporcional à etiqueta real (100mm x 60mm)
// Escala: 1mm = 3.78px (96dpi)
export function LabelPreview({ data }: Props) {
  return (
    <div className="label-preview" style={{ width: 378, height: 227, position: 'relative', border: '1px dashed #ccc', background: '#fff', fontFamily: 'monospace', padding: 8 }}>
      {/* Logo placeholder */}
      <div style={{ position: 'absolute', top: 8, left: 8, width: 60, height: 40, background: '#eee', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 10, color: '#999' }}>
        LOGO
      </div>

      {/* Nome do produto */}
      <div style={{ position: 'absolute', top: 8, left: 80, right: 8, fontWeight: 'bold', fontSize: 14, overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>
        {data.product_name || 'Nome do Produto'}
      </div>

      {/* COD */}
      <div style={{ position: 'absolute', top: 32, left: 80, fontSize: 11, color: '#444' }}>
        COD: {data.code || '000000'}
      </div>

      {/* Código de barras (representação visual simples) */}
      <div style={{ position: 'absolute', top: 55, left: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <div style={{ display: 'flex', gap: 1 }}>
          {Array.from({ length: 30 }).map((_, i) => (
            <div key={i} style={{ width: i % 3 === 0 ? 3 : 1, height: 40, background: '#000' }} />
          ))}
        </div>
        <span style={{ fontSize: 9, marginTop: 2 }}>{data.barcode || '0000000000000'}</span>
      </div>

      {/* Preço */}
      <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 24, fontWeight: 'bold', color: '#000' }}>
        R$ {data.price || '0,00'}
      </div>
    </div>
  );
}
