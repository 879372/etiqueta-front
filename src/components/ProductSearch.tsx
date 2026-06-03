import { useState, useEffect, useRef } from 'react';
import { fetchProducts } from '../services/productsApi';
import type { Product } from '../services/productsApi';

interface ProductSearchProps {
  onSelect: (product: Product) => void;
}

export function ProductSearch({ onSelect }: ProductSearchProps) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [wrapperRef]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.length >= 2) {
        setIsSearching(true);
        try {
          const data = await fetchProducts(query);
          setResults(data);
          setShowDropdown(true);
        } catch (error) {
          console.error('Error fetching products:', error);
        } finally {
          setIsSearching(false);
        }
      } else {
        setResults([]);
        setShowDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  const handleSelect = (product: Product) => {
    onSelect(product);
    setQuery('');
    setShowDropdown(false);
  };

  return (
    <div className="card product-search" ref={wrapperRef}>
      <h2>🔍 Pesquisar Produto</h2>
      <div className="search-input-wrapper" style={{ position: 'relative' }}>
        <span className="search-icon">🔎</span>
        <input
          type="text"
          placeholder="Digite o código, nome ou código de barras..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => { if (results.length > 0) setShowDropdown(true); }}
        />
        {isSearching && <span style={{ position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' }}>⏳</span>}
        
        {showDropdown && results.length > 0 && (
          <ul className="search-dropdown" style={{
            position: 'absolute', top: '100%', left: 0, right: 0, 
            background: 'var(--surface-color)', border: '1px solid var(--border-color)', 
            borderRadius: '4px', zIndex: 10, listStyle: 'none', padding: 0, margin: 0,
            maxHeight: '200px', overflowY: 'auto', boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
          }}>
            {results.map(p => (
              <li 
                key={p.id} 
                onClick={() => handleSelect(p)}
                style={{ padding: '0.5rem 1rem', cursor: 'pointer', borderBottom: '1px solid var(--border-color)' }}
                onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = 'var(--bg-color)')}
                onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = 'transparent')}
              >
                <strong>{p.codigo}</strong> - {p.descricao} (R$ {p.valor})
              </li>
            ))}
          </ul>
        )}
      </div>
      {showDropdown && results.length === 0 && query.length >= 2 && !isSearching && (
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          Nenhum produto encontrado.
        </p>
      )}
    </div>
  );
}

