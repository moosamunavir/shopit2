import React from "react";
import { Link } from "react-router-dom";

// import StarRatings from "react-star-ratings";

const ProductItem = ({ product, columnSize }) => {
  return (
    <div className={`col-6 col-md-6 col-lg-${columnSize} mt-1`}>
      <div className="card p-3 rounded">
        <img
          className="card-img-top mx-auto"
          src={
            product?.images[0]
              ? product?.images[0]?.url
              : "/images/default_product.png"
          }
          alt={product?.name}
        />
        <div className="card-body ps-3 d-flex justify-content-center flex-column">
          <h5 className="card-title product-title">
            <Link to={`/product/${product?._id}`}>{product?.name}</Link>
          </h5>
          <p className="card-text mt-2">${product?.price}</p>
          <Link
            to={`/product/${product?._id}`}
            id="view_btn"
            className="btn btn-block"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProductItem;