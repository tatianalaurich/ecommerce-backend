import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/users.repository.js";
import { transporter } from "../config/nodemailer.js";

const userRepository = new UserRepository();

export const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await userRepository.getUserByEmail(email);

        if (!user) {
        return res.json({
            status: "success",
            message: "Si el usuario existe, se enviará un correo para restablecer la contraseña"
        });
        }

        const token = jwt.sign(
        { email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
        );

        const resetLink = `${process.env.BASE_URL}/api/sessions/reset-password/${token}`;

        await transporter.sendMail({
        from: process.env.MAIL_USER,
        to: user.email,
        subject: "Restablecimiento de contraseña",
        html: `
            <h2>Recuperación de contraseña</h2>
            <p>Hacé click en el siguiente botón para restablecer tu contraseña:</p>
            <a href="${resetLink}" style="padding:10px 20px; background:#007bff; color:#fff; text-decoration:none; border-radius:5px;">
            Restablecer contraseña
            </a>
            <p>Este enlace expira en 1 hora.</p>
        `
        });

        res.json({
        status: "success",
        message: "Si el usuario existe, se enviará un correo para restablecer la contraseña"
        });
    } catch (error) {
        res.status(500).json({ status: "error", error: error.message });
    }
};

export const resetPassword = async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;

        const payload = jwt.verify(token, process.env.JWT_SECRET);

        const user = await userRepository.getUserByEmail(payload.email);

        if (!user) {
        return res.status(404).json({
            status: "error",
            error: "Usuario no encontrado"
        });
        }

        const samePassword = bcrypt.compareSync(newPassword, user.password);

        if (samePassword) {
        return res.status(400).json({
            status: "error",
            error: "La nueva contraseña no puede ser igual a la anterior"
        });
        }

        const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

        await userRepository.updateUser(user._id, {
        password: hashedPassword
        });

        res.json({
        status: "success",
        message: "Contraseña restablecida correctamente"
        });
    } catch (error) {
        res.status(400).json({
        status: "error",
        error: "Token inválido o expirado"
        });
    }
};