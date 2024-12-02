import React from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const ProductCard = ({ product }) => {

  const reloadPage = () => {
    window.location.reload(); // Reloads the current page
  };

  return (
    <div className="card p-2">
      <img
        src={product.images[0]?.url || "/images/default_product.png"}
        alt={product.name}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title ms-2 pt-3">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h5>
        <p className="card-text ms-2">${product.price}</p>
        <Link
            to={`/product/${product?._id}`}
            id="view_btn"
            className="btn btn-block ms-3"
            onClick={reloadPage}

          >
            View Details
          </Link>
      </div>
    </div>
  );
};

export default ProductCard;
