import "dotenv/config";
import mongoose from "mongoose";
import app from "./src/app.js";

const PORT = process.env.PORT || 8080;

const startServer = async () => {
    try {
        if (!process.env.MONGO_URL) {
        console.warn("⚠️ Falta MONGO_URL en .env (igual levanto el server).");
        } else {
        await mongoose.connect(process.env.MONGO_URL);
        console.log("✅ MongoDB conectado");
        }

        app.listen(PORT, () => {
        console.log(`🚀 Server escuchando en http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error("❌ Error al iniciar el servidor:", err.message);
        process.exit(1);
    }
};

startServer();