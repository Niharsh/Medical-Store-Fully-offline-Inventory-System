import React from 'react';
import AddProductForm from '../components/Product/AddProductForm';
import ProductList from '../components/Product/ProductList';

const Inventory = () => {
  const handleProductAdded = () => {
    // Refresh product list is handled by context
  };

  return (
    <div className="space-y-8">
      <AddProductForm onProductAdded={handleProductAdded} />
      <ProductList />
    </div>
  );
};

export default Inventory;
