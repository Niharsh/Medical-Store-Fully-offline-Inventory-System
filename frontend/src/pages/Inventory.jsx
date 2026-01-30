import React, { useState } from 'react';
import AddProductForm from '../components/Product/AddProductForm';
import ProductList from '../components/Product/ProductList';
import { useProducts } from '../context/ProductContext';

const Inventory = () => {
  const { deleteProduct } = useProducts();
  const [editingProduct, setEditingProduct] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  const handleProductAdded = () => {
    setEditingProduct(null);
    // Refresh product list is handled by context
  };

  const handleEdit = (product) => {
    console.log('📝 Edit product:', product);
    setEditingProduct(product);
    setShowEditModal(true);
  };

  const handleDelete = async (productId) => {
    console.log('🗑️ Delete product:', productId);
    // Use non-blocking confirmation
    const confirmed = window.confirm('Are you sure you want to delete this product? This action cannot be undone.');
    if (!confirmed) {
      console.log('Delete cancelled by user');
      return;
    }
    try {
      await deleteProduct(productId);
      console.log('✅ Delete successful, product removed from inventory');
      // Refresh the product list to ensure consistency
      // Note: ProductContext already filters the deleted product
    } catch (error) {
      console.error('❌ Delete failed:', error);
      alert('Failed to delete product: ' + (error.message || 'Unknown error'));
    }
  };

  return (
    <div className="space-y-8">

      {/* Product creation FORM */}
      <AddProductForm
        onProductAdded={handleProductAdded}
        editingProduct={editingProduct}
      />
        

      {/* Inventory LIST (MUST be outside the form) */}
      <div className="card">
        <ProductList onEdit={handleEdit} onDelete={handleDelete} />
      </div>

    </div>
  );
};

export default Inventory;
