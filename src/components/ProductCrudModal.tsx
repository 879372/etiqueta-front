import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { fetchProducts, createProduct, updateProduct, deleteProduct } from '../services/productsApi';
import type { Product } from '../services/productsApi';

interface ProductCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProductCrudModal({ isOpen, onClose }: ProductCrudModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Product>({
    codigo: '',
    descricao: '',
    codigo_de_barras: '',
    valor: '',
  });

  useEffect(() => {
    if (isOpen) {
      loadProducts();
    }
  }, [isOpen]);

  const loadProducts = async () => {
    setLoading(true);
    try {
      const data = await fetchProducts();
      setProducts(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (editingId) {
        await updateProduct(editingId, formData);
      } else {
        await createProduct(formData);
      }
      setFormData({ codigo: '', descricao: '', codigo_de_barras: '', valor: '' });
      setEditingId(null);
      loadProducts();
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleEdit = (product: Product) => {
    setEditingId(product.id!);
    setFormData(product);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja remover este produto?')) {
      try {
        await deleteProduct(id);
        loadProducts();
      } catch (err: any) {
        setError(err.message);
      }
    }
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setFormData({ codigo: '', descricao: '', codigo_de_barras: '', valor: '' });
    setError('');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Gerenciar Produtos">
      <div className="product-crud">
        {error && <div className="message error" style={{ marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSave} className="crud-form card" style={{ marginBottom: '2rem' }}>
          <h3>{editingId ? 'Editar Produto' : 'Novo Produto'}</h3>
          <div className="form-grid" style={{ gridTemplateColumns: '1fr 1fr' }}>
            <div className="form-group">
              <label>Código*</label>
              <input
                required
                type="text"
                value={formData.codigo}
                onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Código de Barras</label>
              <input
                type="text"
                value={formData.codigo_de_barras || ''}
                onChange={(e) => setFormData({ ...formData, codigo_de_barras: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label>Descrição*</label>
              <input
                required
                type="text"
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label>Valor*</label>
              <input
                required
                type="number"
                step="0.01"
                min="0"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {editingId ? 'Salvar Alterações' : 'Adicionar Produto'}
            </button>
            {editingId && (
              <button type="button" className="btn-secondary" onClick={handleCancelEdit}>
                Cancelar
              </button>
            )}
          </div>
        </form>

        <div className="products-list">
          <h3>Lista de Produtos</h3>
          {loading ? (
            <p>Carregando...</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-color)', textAlign: 'left' }}>
                  <th style={{ padding: '0.5rem' }}>Código</th>
                  <th style={{ padding: '0.5rem' }}>Descrição</th>
                  <th style={{ padding: '0.5rem' }}>Valor (R$)</th>
                  <th style={{ padding: '0.5rem', textAlign: 'right' }}>Ações</th>
                </tr>
              </thead>
              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '1rem' }}>
                      Nenhum produto cadastrado.
                    </td>
                  </tr>
                ) : (
                  products.map(p => (
                    <tr key={p.id} style={{ borderBottom: '1px solid var(--border-color)' }}>
                      <td style={{ padding: '0.5rem' }}>{p.codigo}</td>
                      <td style={{ padding: '0.5rem' }}>{p.descricao}</td>
                      <td style={{ padding: '0.5rem' }}>{p.valor}</td>
                      <td style={{ padding: '0.5rem', textAlign: 'right' }}>
                        <button 
                          onClick={() => handleEdit(p)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer', marginRight: '0.5rem' }}
                        >
                          ✏️
                        </button>
                        <button 
                          onClick={() => handleDelete(p.id!)}
                          style={{ background: 'none', border: 'none', cursor: 'pointer' }}
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Modal>
  );
}
