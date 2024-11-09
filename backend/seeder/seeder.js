import mongoose from "mongoose";
import product from "../models/product.js";
import products from "./data.js";

const seedProduct = async () => {
  try {
    await mongoose.connect("mongodb+srv://moosakpmunavir:3hs8GlUbhhFFOqHm@shopit2.naql6.mongodb.net/?retryWrites=true&w=majority&appName=shopit2");

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
