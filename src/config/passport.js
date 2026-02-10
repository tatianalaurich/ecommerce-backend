import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Strategy as JwtStrategy, ExtractJwt } from "passport-jwt";
import { UserModel } from "../models/user.model.js";
import { createHash, isValidPassword } from "../utils/crypto.js";

export const initializePassport = () => {
    passport.use(
        "register",
        new LocalStrategy(
        { usernameField: "email", passReqToCallback: true },
        async (req, email, password, done) => {
            try {
            const { first_name, last_name, age } = req.body;

            const exists = await UserModel.findOne({ email });
            if (exists) return done(null, false, { message: "Email ya registrado" });

            const user = await UserModel.create({
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
            const user = await UserModel.findOne({ email });
            if (!user) return done(null, false, { message: "Usuario no encontrado" });

            if (!isValidPassword(password, user.password))
                return done(null, false, { message: "Password incorrecta" });

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
            const user = await UserModel.findById(jwtPayload.id).select("-password");
            if (!user) return done(null, false, { message: "Token válido pero usuario no existe" });

            return done(null, user);
            } catch (err) {
            return done(err, false);
            }
        }
        )
    );
};
