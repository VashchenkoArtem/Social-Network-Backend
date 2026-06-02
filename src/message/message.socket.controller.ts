import { MessageService } from "./message.service";
import { IMessageSocketControllerContract } from "./message.types";

export const MessageSocketController: IMessageSocketControllerContract = {
    registerHandlers (socketServer, socket) {
        socket.on("sendMessage", (data) => {
            console.log(data,' dndsad')
            this.sendMessage(socketServer, socket, data)
        })
    },

    async sendMessage(socketServer, socket, data) {
        try {
    //         data: {
    //     id: number;
    //     created_at: Date;
    //     text: string;
    //     chat_id: number;
    //     sender_id: number;
    //     user_app_user: {
    //         id: number;
    //         username: string;
    //         profile_app_profile: {
    //             id: number;
    //             avatar: string;
    //         };
    //     };
    // };
            const tempMessage = {
                id: BigInt(Number(new Date(Date.now()))),
                created_at: new Date(Date.now()),
                text: data.text,
                chat_id: BigInt(data.chat_id),
                sender_id: BigInt(socket.data.userId),
                user_app_user: {
                    id: BigInt(Number(new Date(Date.now()))),
                    username: data.username,
                    profile_app_profile: {
                        id: BigInt(Number(new Date(Date.now()))),
                        avatar: data.avatar
                    }
                }

            }
            this.newMessage(socketServer, tempMessage)
            await MessageService.createMessage({
                text: data.text,
                chat_id: data.chat_id,
                created_at: new Date(Date.now()),
                sender_id: socket.data.userId
            })
        } catch (error) {
            throw error
        }
    },

    newMessage: async (socketServer, message) => {
        try {
            socketServer.to(
                `chat-${message.chat_id}`
            ).emit(
                'newMessage',
                message
            )
        } catch (error) {
            throw error
        }
    }
}