import { compare } from "bcrypt";
import {sign} from "jsonwebtoken";
import { UserRepository } from "./user.repository";
import type { IServiceContract } from "./user.types";

export const UserService: IServiceContract = {
    login: async (data) => {
        const user = await UserRepository.findByEmail(data.email)

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
            '',
            { expiresIn: '7d' }
        )
        return { token }
    }
}