import { useEffect, useState } from 'react';
import { listPrinters } from '../services/qztray';

interface Props {
  onSelect: (printer: string) => void;
}

export function PrinterSelect({ onSelect }: Props) {
  const [printers, setPrinters] = useState<string[]>([]);
  const [selected, setSelected] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    listPrinters()
      .then(list => {
        setPrinters(list);
        if (list.length > 0) {
          setSelected(list[0]);
          onSelect(list[0]);
        }
      })
      .catch((err) => {
        console.error(err);
        setError(`QZ Tray não encontrado (${err.message || err}). Verifique se está aberto.`);
      });
  }, []);

  if (error) return <p className="error">{error}</p>;

  return (
    <div className="printer-select">
      <h2>🖨️ Selecionar Impressora</h2>
      <div className="field" style={{ marginTop: '1rem', marginBottom: 0 }}>
        <select
        value={selected}
        onChange={e => {
          setSelected(e.target.value);
          onSelect(e.target.value);
        }}
      >
        <option value="" disabled>
          {printers.length === 0 ? 'Nenhuma impressora encontrada' : 'Selecione uma impressora...'}
        </option>
        {printers.map(p => (
          <option key={p} value={p}>{p}</option>
        ))}
      </select>
      </div>
    </div>
  );
}
