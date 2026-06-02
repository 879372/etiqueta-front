import type { LabelData } from '../services/api';
import logoUrl from '../assets/logo.png';

interface Props {
  data: LabelData;
}

// Preview visual proporcional à etiqueta real (100mm x 60mm)
// Escala: 1mm = 3.78px (96dpi)
export function LabelPreview({ data }: Props) {
  if (data.model === 'small_3') {
    return (
      <div style={{ display: 'flex', width: 340, height: 57, background: '#fff', border: '1px dashed #ccc', fontFamily: 'monospace' }}>
        {[0, 1, 2].map(col => (
          <div key={col} style={{ flex: 1, borderRight: col < 2 ? '1px dashed #eee' : 'none', padding: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ fontSize: 9, fontWeight: 'bold', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>
              {data.product_name || 'Nome Produto'}
            </div>
            <div style={{ fontSize: 8, color: '#444', marginTop: 2 }}>
              COD: {data.code || '00000'}
            </div>
            <div style={{ fontSize: 10, fontWeight: 'bold', position: 'absolute', top: 12, right: 4 }}>
              R$ {data.price || '0,00'}
            </div>
            <div style={{ position: 'absolute', bottom: 4, left: 4, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: 1 }}>
                {Array.from({ length: 15 }).map((_, i) => (
                  <div key={i} style={{ width: i % 2 === 0 ? 1 : 2, height: 12, background: '#000' }} />
                ))}
              </div>
              <span style={{ fontSize: 6 }}>{data.barcode || '0000'}</span>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (data.model === 'medium_115x35') {
    return (
      <div style={{ width: 434, height: 132, background: '#fff', border: '1px dashed #ccc', fontFamily: 'monospace', padding: 8, position: 'relative' }}>
        <div style={{ fontSize: 18, fontWeight: 'bold', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', marginBottom: 12 }}>
          {data.product_name || 'Nome do Produto'}
        </div>
        
        {/* Placeholder para Logo */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, width: 80, height: 80, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={logoUrl} alt="Logo" style={{ maxWidth: '100%', maxHeight: '100%', filter: 'grayscale(100%) contrast(200%)' }} />
        </div>

        <div style={{ position: 'absolute', bottom: 65, left: 110, fontSize: 14, color: '#444' }}>
          COD: {data.code || '00000'}
        </div>
        <div style={{ position: 'absolute', bottom: 12, left: 110, display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
          <div style={{ display: 'flex', gap: 2 }}>
            {Array.from({ length: 30 }).map((_, i) => (
              <div key={i} style={{ width: i % 3 === 0 ? 3 : i % 2 === 0 ? 2 : 1, height: 40, background: '#000' }} />
            ))}
          </div>
          <span style={{ fontSize: 12, marginTop: 4 }}>{data.barcode || '000000000000'}</span>
        </div>
        <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: 32, fontWeight: 'bold' }}>
          R$ {data.price || '0,00'}
        </div>
      </div>
    );
  }

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
