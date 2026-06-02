import { useState } from 'react';
import { LabelForm } from './components/LabelForm';
import { PrinterSelect } from './components/PrinterSelect';
import { LabelPreview } from './components/LabelPreview';
import { ProductSearch } from './components/ProductSearch';
import { Modal } from './components/Modal';
import { generateTspl } from './services/api';
import type { LabelData } from './services/api';
import { printRaw } from './services/qztray';
import logoUrl from './assets/logo.png';

function App() {
  const [printer, setPrinter] = useState('');
  const [labelData, setLabelData] = useState<LabelData>({
    model: 'medium_115x35',
    product_name: '',
    code: '',
    barcode: '',
    price: '',
    copies: 1,
  });
  
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', isError: false });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePrint = async () => {
    if (!printer) {
      setMessage({ text: 'Selecione uma impressora antes de imprimir.', isError: true });
      setIsModalOpen(false);
      return;
    }

    setLoading(true);
    setMessage({ text: '', isError: false });

    try {
      // 1. Django gera o TSPL2
      const tspl = await generateTspl(labelData);

      // 2. QZ Tray envia para a impressora
      await printRaw(printer, tspl);

      setMessage({ text: `✅ ${labelData.copies} etiqueta(s) enviada(s) para impressão!`, isError: false });
      setIsModalOpen(false); // Fecha o modal após sucesso
    } catch (err: any) {
      setMessage({ text: `❌ Erro ao imprimir: ${err.message || JSON.stringify(err)}`, isError: true });
      setIsModalOpen(false); // Fecha o modal em caso de erro para ver a mensagem
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app">
      <header>
        <img src={logoUrl} alt="Câmara Cascudo" className="header-logo" />
        <h1>Sistema de Etiquetas</h1>
      </header>

      <main>
        {message.text && (
          <div className={`message ${message.isError ? 'error' : ''}`} style={{ gridColumn: '1 / -1' }}>
            {message.text}
          </div>
        )}

        <ProductSearch />

        <div className="card">
          <PrinterSelect onSelect={setPrinter} />
        </div>

        <LabelForm
          data={labelData}
          onChange={(data) => setLabelData(prev => ({ ...prev, ...data }))}
          onPreview={() => setIsModalOpen(true)}
        />
      </main>

      <Modal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        title="Pré-visualização da Etiqueta"
        footer={
          <>
            <button className="btn-secondary" onClick={() => setIsModalOpen(false)} style={{ flex: 1, padding: '0.875rem' }}>
              Voltar e Editar
            </button>
            <button 
              className="btn-primary" 
              onClick={handlePrint} 
              disabled={loading}
              style={{ flex: 1 }}
            >
              {loading ? 'Enviando...' : '🖨️ Confirmar e Imprimir'}
            </button>
          </>
        }
      >
        <LabelPreview data={labelData} />
        
        {!printer && (
          <p style={{ color: '#bf2600', marginTop: '1rem', textAlign: 'center', fontSize: '0.9rem' }}>
            ⚠️ Nenhuma impressora selecionada! Escolha uma antes de confirmar.
          </p>
        )}
      </Modal>
    </div>
  );
}

export default App;
