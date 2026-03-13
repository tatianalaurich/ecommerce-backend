import { Router } from "express";
import passport from "passport";
import { generateToken } from "../utils/jwt.js";
import UserDTO from "../dto/user.dto.js";
import { forgotPassword, resetPassword } from "../controllers/sessions.controller.js";

const router = Router();

router.post(
    "/forgot-password", 
    forgotPassword
);

router.post(
    "/reset-password/:token", 
    resetPassword
);

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
        const userDto = new UserDTO(req.user);

        res.json({
        status: "success",
        user: userDto
        });
    }
);

export default router;
