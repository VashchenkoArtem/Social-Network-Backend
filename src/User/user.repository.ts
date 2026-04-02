import { client } from "../client/client";
import { IUserRepositoryContract } from "./user.types";


export const UserRepository: IUserRepositoryContract = {
    findUserByEmail: async (email: string) => {
        return await client.user.findUnique({
            where: { email }
        })
    },
    createUser: async (data) => {
        const dataWithoutCode = {...data, code: undefined}
        const user = await client.user.create({
            data: dataWithoutCode
        });
        return user
    },

    // updateNickname: async (id: number, nickname: string): Promise<User> => {
    //     return await client.user.update({
    //         where: { id },
    //         data: { nickname }
    //     });
    // },

    // upsertOtp: async (email: string, code: string): Promise<void> => {
    //     await client.otp.upsert({
    //         where: { email },
    //         update: { code, createdAt: new Date() },
    //         create: { email, code }
    //     });
    // },

    // getOtpByEmail: async (email: string) => {
    //     return await client.otp.findUnique({
    //         where: { email },
    //         select: { code: true }
    //     });
    // },

    // deleteOtp: async (email: string): Promise<void> => {
    //     await client.otp.delete({
    //         where: { email }
    //     });
    // }
};