import CartRepository from "../repositories/cart.repository.js";
import TicketRepository from "../repositories/ticket.repository.js";

const cartRepository = new CartRepository();
const ticketRepository = new TicketRepository();

export const processPurchase = async (cid, purchaserEmail) => {
    const cart = await cartRepository.getCartByIdPopulated(cid);

    if (!cart) {
        throw new Error("Carrito no encontrado");
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
        purchaser: purchaserEmail
        });
    }

    cart.products = productsNotPurchased;
    await cart.save();

    return {
        ticket,
        productsNotPurchased
    };
};