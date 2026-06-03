import { useState, useEffect } from 'react';
import { fetchProducts } from '../services/productsApi';
import type { Product } from '../services/productsApi';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Load initial 10 products
  useEffect(() => {
    const loadInitial = async () => {
      setIsSearching(true);
      try {
        const data = await fetchProducts();
        setResults(data.slice(0, 10)); // Take first 10
      } catch (error) {
        console.error('Error fetching initial products:', error);
      } finally {
        setIsSearching(false);
      }
    };
    loadInitial();
  }, []);

  // Filter products based on search
  useEffect(() => {
    if (!query) {
      // If query is cleared, fetch the first 10 again (or just leave it as is if we cache, but fetching is fine)
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
        setResults(data.slice(0, 10)); // Limit to 10 results for layout sanity
      } catch (error) {
        console.error('Error fetching products:', error);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  return (
    <div className="glass-card product-search" style={{ marginTop: '2rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h2 style={{ marginBottom: 0 }}>🔍 Buscar e Selecionar Produto</h2>
        <div className="search-input-wrapper" style={{ width: '400px', maxWidth: '100%' }}>
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Buscar por código, nome ou barras..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          {isSearching && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>⏳</span>}
        </div>
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
                  <td>{p.valor}</td>
                  <td style={{ textAlign: 'right' }}>
                    <button 
                      className="btn-primary" 
                      style={{ padding: '0.5rem 1rem', width: 'auto', display: 'inline-block' }}
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
    </div>
  );
}

