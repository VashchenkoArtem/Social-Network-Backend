import bcrypt, { compare } from "bcrypt";
import jwt, { sign } from "jsonwebtoken";
import nodemailer from "nodemailer";
import { IUserServiceContract, AuthToken, CreateUser, VerifyPayload } from "./user.types";
import { cleanEnv, str } from "envalid";
import { UserRepository } from "./user.repository";
const verificationCodes = new Map<string, string>();
const ENV = cleanEnv(process.env, {
    MAIL_USER: str(),
    MAIL_PASS: str(),
    JWT_SECRET: str()
})


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: ENV.MAIL_USER,
        pass: ENV.MAIL_PASS
    }
});

export const UserService: IUserServiceContract = {
    sendCode: async (data) => {
        const code = Math.floor(100000 + Math.random() * 900000).toString();

        verificationCodes.set(data.email, code);

        await transporter.sendMail({
            from: 'mobileteamsocial@gmail.com',
            to: data.email,
            subject: "Код підтвердження",
            html: `<h1>Ваш код: ${code}</h1>`
        });

        return { message: "Verification code sent to email" };
    },
    registration: async (data) => {
        const savedCode = verificationCodes.get(data.email);

        if (!savedCode || savedCode !== data.code) {
            throw new Error("Invalid or expired verification code");
        }

        verificationCodes.delete(data.email);
        const hashedPassword = await bcrypt.hash(data.password, 10);
        const foundedUser = await UserRepository.findUserByEmail(data.email);

        if (foundedUser) {
            throw new Error("User already exists");
        }
        const dataWithoutCode = {...data, code: undefined}
        const createdUser = await UserRepository.createUser({...dataWithoutCode, password: hashedPassword });
        if (typeof createdUser === "string") {
            throw new Error("User was not created")
        }
        const token = sign(
            { id: createdUser.id },
            ENV.JWT_SECRET,
            { expiresIn: '7d' }
        )
        return { token }
    },
    login: async (data) => {
        const user = await UserRepository.findUserByEmail(data.email)

        if (!user) {
            return 'User was not found. Try again, please'
        }
        
        if (typeof user === "string") {
            return user
        }

        const userConfirmation = await compare(data.password, user.password)
        if (!userConfirmation) {
            return 'You entered wrong credentionals. Try again, please'
        }

        const token = sign(
            { id: user.id },
            ENV.JWT_SECRET,
            { expiresIn: '7d' }
        )
        return { token }
    },
    me: async (id) => {
        const user = await UserRepository.me(id)

        if (typeof user === "string") {
            return user
        }
        return user
    },
    updateUser(data, userId) {
        const userData = UserRepository.updateUser(data, userId)
        if (typeof userData === "string") {
            return userData
        }
        return userData
    }
    
};