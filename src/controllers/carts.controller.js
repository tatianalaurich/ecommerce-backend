import CartRepository from "../repositories/cart.repository.js";
import ProductRepository from "../repositories/product.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";

const cartRepository = new CartRepository();
const productRepository = new ProductRepository();
const ticketRepository = new TicketRepository();

export const createCart = async (req, res) => {
    try {
        const cart = await cartRepository.createCart();
        res.status(201).json({ status: "success", payload: cart });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const getCartById = async (req, res) => {
    try {
        const cart = await cartRepository.getCartByIdPopulated(req.params.cid);

        if (!cart) {
        return res.status(404).json({
            status: "error",
            error: "Carrito no encontrado"
        });
        }

        res.json({ status: "success", payload: cart });
    } catch (error) {
        res.status(400).json({ status: "error", error: "ID inválido" });
    }
};

export const addProductToCart = async (req, res) => {
    try {
        const cart = await cartRepository.getCartById(req.params.cid);
        if (!cart) {
        return res.status(404).json({
            status: "error",
            error: "Carrito no encontrado"
        });
        }

        const product = await productRepository.getProductById(req.params.pid);
        if (!product) {
        return res.status(404).json({
            status: "error",
            error: "Producto no encontrado"
        });
        }

        const updatedCart = await cartRepository.addProductToCart(
        req.params.cid,
        req.params.pid
        );

        res.json({ status: "success", payload: updatedCart });
    } catch (error) {
        res.status(400).json({ status: "error", error: error.message });
    }
};

export const purchaseCart = async (req, res) => {
    try {
        const cart = await cartRepository.getCartByIdPopulated(req.params.cid);

        if (!cart) {
        return res.status(404).json({
            status: "error",
            error: "Carrito no encontrado"
        });
        }

        const productsToPurchase = [];
        const productsNotPurchased = [];

        for (const item of cart.products) {
        const product = item.product;

        if (product.stock >= item.quantity) {
            product.stock -= item.quantity;
            await product.save();
            productsToPurchase.push(item);
        } else {
            productsNotPurchased.push(item);
        }
        }

        const amount = productsToPurchase.reduce((total, item) => {
        return total + item.product.price * item.quantity;
        }, 0);

        let ticket = null;

        if (productsToPurchase.length > 0) {
        ticket = await ticketRepository.createTicket({
            code: `TICKET-${Date.now()}`,
            amount,
            purchaser: req.user.email
        });
        }

        cart.products = productsNotPurchased;
        await cart.save();

        res.json({
        status: "success",
        message: "Compra procesada",
        ticket,
        productsNotPurchased
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};