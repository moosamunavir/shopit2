import React, { useEffect } from "react";
import MetaData from "./layout/MetaData";
import { useGetProductsQuery } from "../redux/api/productsApi";
import ProductItem from "./product/productItem";
import Loader from "./layout/Loader";
import toast from "react-hot-toast";
import CustomPagination from "./layout/CustomPagination";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import Filters from "./layout/Filters";

import { PRODUCT_CATEGORIES } from "../constants/constants.js";


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

  useEffect(() => {
    if (isError) {
      toast.error(error?.data?.message);
    }
  }, [isError]);

   // handle category rating filters

   const handleClick = (checkbox) => {
    const checkboxes = document.getElementsByName(checkbox.name);

    checkboxes.forEach((item) => {
      if (item !== checkbox) item.checked = false;
    });

    if (checkbox.checked === false) {
      // Delete filter from query
      if (searchParams.has(checkbox.name)) {
        searchParams.delete(checkbox.name);
        const path = window.location.pathname + "?" + searchParams.toString();
        navigate(path);
      }
    } else {
      // set new filter value if already there
      if (searchParams.has(checkbox.name)) {
        searchParams.set(checkbox.name, checkbox.value);
      } else {
        // append new filter
        searchParams.append(checkbox.name, checkbox.value);
      }
      const path = window.location.pathname + "?" + searchParams.toString();
      navigate(path);
    }
  };
  const defaultCheckHandler = (checkboxType, checkboxValue) => {
    const value = searchParams.get(checkboxType);
    if (checkboxValue === value) return true;
    return false;
  };

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
          It's a E-Commerce Web Page. you can bay any products
        </p>
        <div className="col-12 col-md-9 col-lg-4 secondDiv"></div>

        <p className="h4 text-center">
          We have Products like Electronics, Cameras, Laptops, Accessories,
          Headphones, Food, Books, Sports, Outdoor, Home
        </p>
        <div className="col-12 col-md-9 col-lg-4 thirdDiv"></div>
        <hr />

        <div className="col-12 col-md-9 col-lg-4 checkbox-container">
        {PRODUCT_CATEGORIES?.map((category) => (
        <div className="form-check">
          <input
            className="form-check-input"
            type="checkbox"
            name="category"
            id="check4"
            value={category}
            defaultChecked={defaultCheckHandler("category", category)}
            onClick={(e) => handleClick(e.target)}
          />
          <label className="form-check-label" for="check4">
            {" "}
            {category}
          </label>
        </div>
      ))}  
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
                <ProductItem product={product} columnSize={columnSize} />
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
