import React, { useEffect, useState } from "react";
import MetaData from "../layout/MetaData";

import { useParams } from "react-router-dom";
import {
  useGetProductDetailsQuery,
  useGetRelatedProductsQuery,
} from "../../redux/api/productsApi";
import Loader from "../layout/Loader";
import StarRatings from "react-star-ratings";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { setCartItem } from "../../redux/features/cartSlice";
import NewReview from "../reviews/NewReview";
import ListReviews from "../reviews/ListReviews";
import NotFount from "../layout/NotFount";
import ProductCard from "./ProductCart";

const ProductDetails = () => {
  const params = useParams();
  const dispatch = useDispatch();

  const [quantity, setQuantity] = useState(1);
  const [activeImg, setActiveImg] = useState("");

  const { data, isLoading, error, isError } = useGetProductDetailsQuery(
    params?.id
  );

  const product = data?.product;
  const { data: relatedProducts, isLoading: relatedLoading } =
    useGetRelatedProductsQuery(product?.category, {
      skip: !product?.category,
    });

  const { isAuthenticated } = useSelector((state) => state.auth);
  useEffect(() => {
    setActiveImg(
      product?.images[0]
        ? product?.images[0]?.url
        : "/images/default_product.png"
    );
  }, [product]);

  useEffect(() => {
    if (isError) {
      toast.error("Product Not Fount");
    }
  }, [isError]);

  const increaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber >= product?.stock) return alert("out of stock");

    const qty = count.valueAsNumber + 1;
    setQuantity(qty);
  };

  const decreaseQty = () => {
    const count = document.querySelector(".count");

    if (count.valueAsNumber <= 1) return;

    const qty = count.valueAsNumber - 1;
    setQuantity(qty);
  };

  const setItemToCart = () => {
    const cartItem = {
      product: product?._id,
      name: product?.name,
      price: product?.price,
      image: product?.images[0]?.url,
      stock: product?.stock,
      quantity,
    };
    dispatch(setCartItem(cartItem));
    toast.success("item added to cart");
  };

  if (isLoading) return <Loader />;

  if (error && error.status === 404) {
    return <NotFount />;
  }

  return (
    <>
      <MetaData title={`${product?.name} Details`} />
      <div className="row d-flex justify-content-around pt-1">
        <p className="pname">{product?.name}</p>

        <div className="d-flex">
          <StarRatings
            rating={product?.ratings}
            starRatedColor="#ffb829"
            numberOfStars={5}
            name="rating"
            starDimension="23px"
            starSpacing="1px"
          />
          <span id="no_of_reviews" className="pt-2 ps-2">
            {" "}
            ({product?.numOfReviews}
            {"Reviews "})
          </span>
        </div>
        <div className="col-12 col-lg-5 img-fluid" id="product_image">
          <div className="p-1">
            <img
              className="d-block w-100 pImg"
              src={activeImg}
              alt={product?.name}
              width="300"
              height="300"
            />
          </div>
          <div className="row justify-content-start  pImgAll">
            {product?.images?.map((img) => (
              <div className="col-2 ms-4 mt-2">
                <a role="button">
                  <img
                    className={`d-block border sImg rounded p-3 cursor-pointer ${
                      img.url === activeImg ? "border-warning" : ""
                    } `}
                    height="100"
                    width="100"
                    src={img?.url}
                    alt={img?.url}
                    onClick={(e) => setActiveImg(img.url)}
                  />
                </a>
              </div>
            ))}
          </div>
        </div>

        <div className="col-12 col-lg-5 mt-3">
          <p id="product_price">${product?.price}</p>
          <div className="stockCounter d-inline">
            <span className="btn btn-danger minus" onClick={decreaseQty}>
              -
            </span>
            <input
              type="number"
              className="form-control count d-inline"
              value={quantity}
              readonly
            />
            <span className="btn btn-primary plus" onClick={increaseQty}>
              +
            </span>
          </div>
          <button
            type="button"
            id="cart_btn"
            className="btn btn-primary d-inline ms-4"
            disabled={product?.stock <= 0}
            onClick={setItemToCart}
          >
            Add to Cart
          </button>

          <hr />

          <p>
            Status:{" "}
            <span
              id="stock_status"
              className={product?.stock > 0 ? "greenColor" : "redColor"}
            >
              {product?.stock > 0 ? "In Stock" : "Out of Stock"}
            </span>
          </p>

          <hr />

          <h4 className="mt-2">Description:</h4>
          <p>{product?.description}</p>
          <hr />
          <p id="product_seller mb-3">
            Sold by: <strong>{product?.seller}</strong>
          </p>

          {isAuthenticated ? (
            <NewReview productId={product?._id} />
          ) : (
            <div className="alert alert-danger my-5" type="alert">
              Login to post your review.
            </div>
          )}
        </div>
      </div>
      {product?.reviews?.length > 0 && (
        <ListReviews reviews={product?.reviews} />
      )}

      {/* Related products */}
      <div className="related-products mt-3">
        <h2 className="text-center">Similar Products</h2>
        {relatedLoading ? (
          <Loader />
        ) : (
          <div className="row">
            {relatedProducts?.products?.map((relatedProduct) => (
              <div
                key={relatedProduct._id}
                className="col-6 col-md-4 col-lg-3 mb-4"
              >
                <ProductCard product={relatedProduct} />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default ProductDetails;
