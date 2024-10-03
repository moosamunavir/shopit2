import mongoose from "mongoose";
import product from "../models/product.js";
import products from "./data.js";

const seedProduct = async () => {
  try {
    await mongoose.connect("mongodb://localhost:27017/shopit-v2");

    await product.deleteMany();
    console.log("products are deleted");

    await product.insertMany(products);
    console.log("products are added");

    process.exit();
  } catch (error) {
    console.log(error.message);
    process.exit();
  }
};

seedProduct();
