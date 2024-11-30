import React from "react";
import { Link } from "react-router-dom";
import StarRatings from "react-star-ratings";

const ProductCard = ({ product }) => {
  return (
    <div className="card p-2">
      <img
        src={product.images[0]?.url || "/images/default_product.png"}
        alt={product.name}
        className="card-img-top"
      />
      <div className="card-body">
        <h5 className="card-title">
          <Link to={`/product/${product._id}`}>{product.name}</Link>
        </h5>
        <StarRatings
          rating={product.ratings}
          starRatedColor="#ffb829"
          numberOfStars={5}
          name="rating"
          starDimension="20px"
          starSpacing="1px"
        />
        <p className="card-text">${product.price}</p>
      </div>
    </div>
  );
};

export default ProductCard;
