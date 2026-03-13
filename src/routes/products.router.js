import { Router } from "express";
import passport from "passport";
import { authorizeRoles } from "../middlewares/auth.middleware.js";
import {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct
} from "../controllers/products.controller.js";

const router = Router();

router.get("/", getProducts);
router.get("/:pid", getProductById);

router.post(
    "/",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    createProduct
);

router.put(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    updateProduct
);

router.delete(
    "/:pid",
    passport.authenticate("jwt", { session: false }),
    authorizeRoles("admin"),
    deleteProduct
);

export default router;