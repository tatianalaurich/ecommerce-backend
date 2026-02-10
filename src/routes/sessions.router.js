import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";

const router = Router();

router.post(
    "/register",
    passport.authenticate("register", { session: false }),
    async (req, res) => {
        res.status(201).json({ status: "success", message: "Usuario creado", user: req.user });
    }
);

router.post(
    "/login",
    passport.authenticate("login", { session: false }),
    async (req, res) => {
        const token = generateToken(req.user);

        res.cookie("accessToken", token, {
        httpOnly: true,
        sameSite: "lax",
        secure: false,
        maxAge: 60 * 60 * 1000,
        });

        res.json({ status: "success", token });
    }
);

router.get(
    "/current",
    passport.authenticate("jwt", { session: false }),
    (req, res) => {
        res.json({ status: "success", user: req.user });
    }
);

export default router;
