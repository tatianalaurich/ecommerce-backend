import ProductDao from "../dao/mongo/product.dao.js";

export default class ProductRepository {
    constructor() {
        this.dao = new ProductDao();
    }

    getAllProducts = async () => {
        return this.dao.getAll();
    };

    getProductById = async (id) => {
        return this.dao.getById(id);
    };

    createProduct = async (data) => {
        return this.dao.create(data);
    };

    updateProduct = async (id, data) => {
        return this.dao.update(id, data);
    };

    deleteProduct = async (id) => {
        return this.dao.delete(id);
    };
}