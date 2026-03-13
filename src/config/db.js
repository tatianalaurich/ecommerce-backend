import mongoose from "mongoose";
import config from "./config.js";

export const connectDB = async () => {
    try {
        await mongoose.connect(config.mongoUrl);
        console.log("MongoDB conectado");
    } catch (error) {
        console.error("Error conectando MongoDB:", error.message);
        process.exit(1);
    }
};