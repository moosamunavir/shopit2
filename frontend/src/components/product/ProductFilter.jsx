// src/components/product/ProductFilter.jsx

import React, { useState } from "react";
import ProductItem from "./productItem"; // Ensure you import the ProductItem component

const ProductFilter = ({ PRODUCT_CATEGORIES, ALL_ITEMS }) => {
  const [filteredItems, setFilteredItems] = useState(ALL_ITEMS);

  // Handle category filtering
  const handleCategoryClick = (category) => {
    const filtered = ALL_ITEMS.filter((item) => item.category === category);
    setFilteredItems(filtered);
  };

  // Reset to show all items
  const showAllItems = () => {
    setFilteredItems(ALL_ITEMS);
  };

  return (
    <div>
      <div className="category-buttons my-3">
        {/* Button to show all items */}
      

        {/* Map through categories to create filter buttons */}
        {PRODUCT_CATEGORIES.map((category) => (
          <button
            key={category}
            className="btn btn-primary me-2 category-button"
            onClick={() => handleCategoryClick(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="row">
        {/* Display filtered products */}
        {filteredItems.length > 0 ? (
          filteredItems.map((item) => (
            <ProductItem key={item.id} product={item} columnSize={4} />
          ))
        ) : (
         ""
        )}
      </div>
    </div>
  );
};

export default ProductFilter;
