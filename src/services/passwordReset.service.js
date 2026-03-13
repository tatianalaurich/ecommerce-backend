import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import UserRepository from "../repositories/users.repository.js";
import config from "../config/config.js";
import { transporter } from "../config/nodemailer.js";

const userRepository = new UserRepository();

export const sendResetPasswordEmail = async (email) => {
    const user = await userRepository.getUserByEmail(email);

    if (!user) return;

    const token = jwt.sign(
        { email: user.email },
        config.jwtSecret,
        { expiresIn: "1h" }
    );

    const resetLink = `${config.baseUrl}/api/sessions/reset-password/${token}`;

    await transporter.sendMail({
        from: config.mailUser,
        to: user.email,
        subject: "Restablecimiento de contraseña",
        html: `
        <h2>Recuperación de contraseña</h2>
        <p>Hacé click en el siguiente botón para restablecer tu contraseña:</p>
        <a href="${resetLink}">Restablecer contraseña</a>
        <p>Este enlace expira en 1 hora.</p>
        `
    });
};

export const resetUserPassword = async (token, newPassword) => {
    const payload = jwt.verify(token, config.jwtSecret);

    const user = await userRepository.getUserByEmail(payload.email);
    if (!user) {
        throw new Error("Usuario no encontrado");
    }

    const samePassword = bcrypt.compareSync(newPassword, user.password);
    if (samePassword) {
        throw new Error("La nueva contraseña no puede ser igual a la anterior");
    }

    const hashedPassword = bcrypt.hashSync(newPassword, bcrypt.genSaltSync(10));

    await userRepository.updateUser(user._id, {
        password: hashedPassword
    });

    return true;
};