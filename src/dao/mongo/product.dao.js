import { ProductModel } from "../../models/product.model.js";

export default class ProductDao {
    getAll = async () => {
        return ProductModel.find();
    };

    getById = async (id) => {
        return ProductModel.findById(id);
    };

    create = async (data) => {
        return ProductModel.create(data);
    };

    update = async (id, data) => {
        return ProductModel.findByIdAndUpdate(id, data, { new: true });
    };

    delete = async (id) => {
        return ProductModel.findByIdAndDelete(id);
    };
}