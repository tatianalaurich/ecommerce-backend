import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    createCart,
    getCartById,
    addProductToCart,
    purchaseCart
} from "../controllers/carts.controller.js";

const router = Router();

router.post("/", createCart);
router.get("/:cid", getCartById);

router.post(
    "/:cid/product/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("user"),
    addProductToCart
);

router.post(
    "/:cid/purchase",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("user"),
    purchaseCart
);

export default router;