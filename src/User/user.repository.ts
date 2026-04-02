import { PrismaClient } from "@prisma/client";
import { CreateUser, IUserRepositoryContract, User } from "./user.types";

const client = new PrismaClient();

export const UserRepository: IUserRepositoryContract = {
    createUser: async (data: CreateUser): Promise<User> => {
        return await client.user.create({
            data,
            select: {
                id: true,
                firstname: true,
                lastname: true,
                nickname: true,
                email: true,
                birthDate: true,
                avatar: true,
                signature: true
            }
        });
    },

    updateNickname: async (id: number, nickname: string): Promise<User> => {
        return await client.user.update({
            where: { id },
            data: { nickname }
        });
    },

    upsertOtp: async (email: string, code: string): Promise<void> => {
        await client.otp.upsert({
            where: { email },
            update: { code, createdAt: new Date() },
            create: { email, code }
        });
    },

    getOtpByEmail: async (email: string) => {
        return await client.otp.findUnique({
            where: { email },
            select: { code: true }
        });
    },

    deleteOtp: async (email: string): Promise<void> => {
        await client.otp.delete({
            where: { email }
        });
    }
};