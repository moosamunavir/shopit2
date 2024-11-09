import mongoose from "mongoose";
import product from "../models/product.js";
import products from "./data.js";

const seedProduct = async () => {
  try {
    await mongoose.connect("mongodb+srv://moosakpmunavir:1JKqXNrqyT3gb8h8@shopit.0iulm.mongodb.net/?retryWrites=true&w=majority&appName=shopit");

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
