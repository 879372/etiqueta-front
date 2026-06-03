import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { createProduct, updateProduct } from '../services/productsApi';
import type { Product } from '../services/productsApi';

interface ProductCrudModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product | null;
  onSaveSuccess: () => void;
}

export function ProductCrudModal({ isOpen, onClose, product, onSaveSuccess }: ProductCrudModalProps) {
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState<Product>({
    codigo: '',
    descricao: '',
    codigo_de_barras: '',
    valor: '',
  });

  useEffect(() => {
    if (isOpen) {
      setError('');
      if (product) {
        setFormData(product);
      } else {
        setFormData({ codigo: '', descricao: '', codigo_de_barras: '', valor: '' });
      }
    }
  }, [isOpen, product]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      if (product && product.id) {
        await updateProduct(product.id, formData);
      } else {
        await createProduct(formData);
      }
      onSaveSuccess();
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={product ? 'Editar Produto' : 'Novo Produto'}>
      <div className="product-crud">
        {error && <div className="message error" style={{ marginBottom: '1rem' }}>{error}</div>}
        
        <form onSubmit={handleSave} className="crud-form">
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
          <div style={{ display: 'flex', gap: '1rem', marginTop: '2rem' }}>
            <button type="button" className="btn-secondary" onClick={onClose} style={{ flex: 1 }}>
              Cancelar
            </button>
            <button type="submit" className="btn-primary" style={{ flex: 1 }}>
              {product ? 'Salvar Alterações' : 'Adicionar Produto'}
            </button>
          </div>
        </form>
      </div>
    </Modal>
  );
}
