import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { createHash, isValidPassword } from "../utils/crypto.js";
import UserRepository from "../repositories/user.repository.js";

const userRepository = new UserRepository();

export const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            try {
            const { first_name, last_name, age } = req.body;

            const exists = await userRepository.getUserByEmail(email);
            if (exists) return done(null, false, { message: "Email ya registrado" });

            const user = await userRepository.createUser({
                first_name,
                last_name,
                email,
                age,
                password: createHash(password),
            });

            return done(null, user);
            } catch (err) {
            return done(err);
            }
        }
        )
    );

    passport.use(
        "login",
        new LocalStrategy(
        { usernameField: "email" },
        async (email, password, done) => {
            try {
            const user = await userRepository.getUserByEmail(email);
            if (!user) return done(null, false, { message: "Usuario no encontrado" });

            if (!isValidPassword(password, user.password)) {
                return done(null, false, { message: "Password incorrecta" });
            }

            return done(null, user);
            } catch (err) {
            return done(err);
            }
        }
        )
    );

    passport.use(
        "jwt",
        new JwtStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([
            (req) => req?.cookies?.accessToken,
            ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            secretOrKey: process.env.JWT_SECRET,
        },
        async (jwtPayload, done) => {
            try {
            const user = await userRepository.getUserById(jwtPayload.id);
            if (!user) return done(null, false, { message: "Token válido pero usuario no existe" });

            return done(null, user);
            } catch (err) {
            return done(err, false);
            }
        }
        )
    );
};