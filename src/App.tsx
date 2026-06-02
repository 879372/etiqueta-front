import { useState } from 'react';
import { LabelForm } from './components/LabelForm';
import { PrinterSelect } from './components/PrinterSelect';
import { LabelPreview } from './components/LabelPreview';
import { generateTspl } from './services/api';
import type { LabelData } from './services/api';
import { printRaw } from './services/qztray';

function App() {
  const [labelData, setLabelData] = useState<LabelData>({
    product_name: '',
    code: '',
    barcode: '',
    price: '',
    copies: 1,
  });
  const [printer, setPrinter] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handlePrint = async () => {
    if (!printer) {
      setMessage('Selecione uma impressora.');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      // 1. Django gera o TSPL2
      const tspl = await generateTspl(labelData);

      // 2. QZ Tray envia para a impressora
      await printRaw(printer, tspl);

      setMessage(`✅ ${labelData.copies} etiqueta(s) enviada(s) para impressão!`);
    } catch (err) {
      setMessage('❌ Erro ao imprimir. Verifique a impressora, o QZ Tray, e a conexão com o backend.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <h1>🏷️ Impressão de Etiquetas</h1>
      </header>

      <main>
        <section className="form-section">
          <PrinterSelect onSelect={setPrinter} />
          <LabelForm
            onChange={setLabelData}
            onPrint={handlePrint}
            loading={loading}
          />
          {message && <p className="message">{message}</p>}
        </section>

        <section className="preview-section">
          <h2>Preview</h2>
          <LabelPreview data={labelData} />
        </section>
      </main>
    </div>
  );
}

export default App;
