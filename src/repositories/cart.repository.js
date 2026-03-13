import CartDao from "../dao/mongo/cart.dao.js";

export default class CartRepository {
    constructor() {
        this.dao = new CartDao();
    }

    createCart = async () => {
        return this.dao.create();
    };

    getCartById = async (id) => {
        return this.dao.getById(id);
    };

    getCartByIdPopulated = async (id) => {
        return this.dao.getByIdPopulated(id);
    };

    addProductToCart = async (cid, pid) => {
        return this.dao.addProductToCart(cid, pid);
    };

    updateCart = async (cid, data) => {
        return this.dao.update(cid, data);
    };
}