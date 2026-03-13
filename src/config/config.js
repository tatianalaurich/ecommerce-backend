import dotenv from "dotenv";

dotenv.config();

export default {
    port: process.env.PORT || 8080,
    mongoUrl: process.env.MONGO_URL || "mongodb://127.0.0.1:27017/ecommerce",
    jwtSecret: process.env.JWT_SECRET || "secretjwt",
    mailUser: process.env.MAIL_USER,
    mailPass: process.env.MAIL_PASS,
    baseUrl: process.env.BASE_URL || "http://localhost:8080"
};