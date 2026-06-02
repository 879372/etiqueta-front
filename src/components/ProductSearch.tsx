import React, { useState } from 'react';

export function ProductSearch() {
  const [query, setQuery] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implementar busca no backend no futuro
    console.log('Pesquisando por:', query);
  };

  return (
    <div className="card product-search">
      <h2>🔍 Pesquisar Produto</h2>
      <form onSubmit={handleSearch}>
        <div className="search-input-wrapper">
          <span className="search-icon">🔎</span>
          <input
            type="text"
            placeholder="Digite o código ou nome do produto..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button type="submit" className="btn-primary" style={{ width: 'auto' }}>
            Buscar
          </button>
        </div>
        <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>
          *A busca no banco de dados será integrada em breve. Por enquanto preencha os dados abaixo manualmente.
        </p>
      </form>
    </div>
  );
}
