import { CartModel } from "../../models/cart.model.js";

export default class CartDao {
    create = async () => {
        return CartModel.create({ products: [] });
    };

    getById = async (id) => {
        return CartModel.findById(id);
    };

    getByIdPopulated = async (id) => {
        return CartModel.findById(id).populate("products.product");
    };

    addProductToCart = async (cid, pid) => {
        const cart = await CartModel.findById(cid);

        const index = cart.products.findIndex(
        (p) => p.product.toString() === pid
        );

        if (index >= 0) {
        cart.products[index].quantity += 1;
        } else {
        cart.products.push({ product: pid, quantity: 1 });
        }

        await cart.save();
        return cart;
    };

    update = async (cid, data) => {
        return CartModel.findByIdAndUpdate(cid, data, { new: true });
    };
}