import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productsApi';
import type { Product } from '../services/productsApi';
import { ProductCrudModal } from './ProductCrudModal';
import { formatCurrency } from '../utils/format';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [isCrudOpen, setIsCrudOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);

  useEffect(() => {
    if (!query) {
      const loadInitial = async () => {
        setIsSearching(true);
        try {
          const data = await fetchProducts();
          setResults(data.slice(0, 10));
        } catch (error) {
          console.error('Error fetching initial products:', error);
        } finally {
          setIsSearching(false);
        }
      };
      loadInitial();
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setIsSearching(true);
      try {
        const data = await fetchProducts(query);
        setResults(data.slice(0, 10));
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsSearching(false);
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [query, refreshTrigger]);

  const handleAdd = () => {
    setProductToEdit(null);
    setIsCrudOpen(true);
  };

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setIsCrudOpen(true);
  };

  const handleSaveSuccess = () => {
    setIsCrudOpen(false);
    setRefreshTrigger(prev => prev + 1); // trigger reload
  };

  return (
    <div className="glass-card product-search">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
        <h2 style={{ marginBottom: 0 }}>🔍 Buscar e Selecionar Produto</h2>
        <button className="btn-secondary" onClick={handleAdd} style={{ width: 'auto', padding: '0.5rem 1rem' }}>
          ➕ Adicionar
        </button>
      </div>

      <div className="search-input-wrapper" style={{ width: '100%', marginBottom: '1.5rem' }}>
        <span className="search-icon">🔎</span>
        <input
          type="text"
          placeholder="Buscar por código, nome ou barras..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        {isSearching && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>⏳</span>}
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table>
          <thead>
            <tr>
              <th>Código</th>
              <th>Descrição</th>
              <th>Cód. Barras</th>
              <th>Valor (R$)</th>
              <th style={{ textAlign: 'right' }}>Ação</th>
            </tr>
          </thead>
          <tbody>
            {results.length === 0 ? (
              <tr>
                <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>
                  Nenhum produto encontrado.
                </td>
              </tr>
            ) : (
              results.map(p => (
                <tr key={p.id}>
                  <td><strong>{p.codigo}</strong></td>
                  <td>{p.descricao}</td>
                  <td>{p.codigo_de_barras || '-'}</td>
                  <td>{formatCurrency(p.valor)}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="action-btn"
                      onClick={() => handleEdit(p)}
                      title="Editar Produto"
                      style={{ marginRight: '0.5rem' }}
                    >
                      ✏️
                    </button>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.4rem 0.8rem', width: 'auto', display: 'inline-block', fontSize: '0.9rem' }}
                      onClick={() => onSelect(p)}
                    >
                      Selecionar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      <ProductCrudModal 
        isOpen={isCrudOpen} 
        onClose={() => setIsCrudOpen(false)}
        product={productToEdit}
        onSaveSuccess={handleSaveSuccess}
      />
    </div>
  );
}

