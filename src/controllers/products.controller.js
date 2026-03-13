import ProductRepository from "../repositories/product.repository.js";

const productRepository = new ProductRepository();

export const getProducts = async (req, res) => {
    try {
        const products = await productRepository.getAllProducts();
        res.json({ status: "success", payload: products });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const getProductById = async (req, res) => {
    try {
        const product = await productRepository.getProductById(req.params.pid);

        if (!product) {
        return res.status(404).json({
            status: "error",
            error: "Producto no encontrado"
        });
        }

        res.json({ status: "success", payload: product });
    } catch (error) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
};

export const createProduct = async (req, res) => {
    try {
        const created = await productRepository.createProduct(req.body);
        res.status(201).json({ status: "success", payload: created });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

export const updateProduct = async (req, res) => {
    try {
        const updated = await productRepository.updateProduct(req.params.pid, req.body);

        if (!updated) {
        return res.status(404).json({
            status: "error",
            error: "Producto no encontrado"
        });
        }

        res.json({ status: "success", payload: updated });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

export const deleteProduct = async (req, res) => {
    try {
        const deleted = await productRepository.deleteProduct(req.params.pid);

        if (!deleted) {
        return res.status(404).json({
            status: "error",
            error: "Producto no encontrado"
        });
        }

        res.json({ status: "success", message: "Producto eliminado" });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};