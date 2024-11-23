import React, { useEffect, useState } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/productItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";
import { PRODUCT_CATEGORIES } from "../constants/constants.js"; // Import your categories
import ProductFilter from "./product/ProductFilter.jsx"; // Import the ProductFilter component

const Home = () => {
  const navigate = useNavigate();
  let [searchParams] = useSearchParams();
  const page = searchParams.get("page") || 1;
  const keyword = searchParams.get("keyword") || "";
  const min = searchParams.get("min");
  const max = searchParams.get("max");
  const category = searchParams.get("category");
  const ratings = searchParams.get("ratings");

  const params = { page, keyword };

  min !== null && (params.min = min);
  max !== null && (params.max = max);
  category !== null && (params.category = category);
  ratings !== null && (params.ratings = ratings);

  const { data, isLoading, error, isError } = useGetProductsQuery(params);
  const [allItems, setAllItems] = useState([]); // Local state for storing all items

  useEffect(() => {
    if (data && data.products) {
      setAllItems(data.products); // Store all products fetched
    }
  }, [data]);

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

  const columnSize = keyword ? 4 : 3;

  if (isLoading) return <Loader />;

  return (
    <>
      <MetaData title={"Buy Best Products Online"} />

      <div className="row">
        {keyword && (
          <div className="col-6 col-md-3 mt-5">
            <Filters />
          </div>
        )}

        <p className="h3 py-4 text-center">
          It's an E-Commerce Web Page. You can buy any products.
        </p>

        <div className="col-12 col-md-9 col-lg-4 secondDiv"></div>

        <p className="h4 text-center">
          We have Products like Electronics, Cameras, Laptops, Accessories,
          Headphones, Food, Books, Sports, Outdoor, Home
        </p>

        <div className="col-12 col-md-9 col-lg-4 thirdDiv"></div>
        <hr />



        {/* Product Filter Section */}
        <div>
          {/* Pass ALL_ITEMS and PRODUCT_CATEGORIES to ProductFilter */}
          <ProductFilter PRODUCT_CATEGORIES={PRODUCT_CATEGORIES} ALL_ITEMS={allItems} />
        </div>

        <div className={keyword ? "col-6 col-md-9" : "col-12 col-md-12"}>
          <h1 id="products_heading" className="text-secondary text-center">
            {keyword
              ? `${data?.products?.length} Products found with keyword: ${keyword}`
              : "Latest Products...."}
          </h1>

          <section id="products" className="mt-2">
            <div className="row">
              {data?.products?.map((product) => (
                <ProductItem key={product._id} product={product} columnSize={columnSize} />
              ))}
            </div>
          </section>

          <CustomPagination
            resPerPage={data?.resPerPage}
            filteredProductsCount={data?.filteredProductsCount}
          />
         
        </div>
      </div>
    </>
  );
};

export default Home;
