import type { IControllerContract } from "./user.types";
import { UserService } from "./user.service"

export const UserController: IControllerContract ={
    login: async (req, res) => {
        try{
            const data = req.body
            const authUser = await UserService.login(data)

            if (typeof authUser === "string"){
                res.status(400).json(authUser)
                return
            }
            res.status(200).json(authUser)
        } catch (error) {
            if (error instanceof Error) {
                res.json( error.message || "Server error. Please try again." )
            }
        }
    }
}