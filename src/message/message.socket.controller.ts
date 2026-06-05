import { MessageController } from "./message.controller";
import { MessageService } from "./message.service";
import { IMessageSocketControllerContract } from "./message.types";

export const MessageSocketController: IMessageSocketControllerContract = {
    registerHandlers (socketServer, socket) {
        socket.on("sendMessage", (data) => {
            this.sendMessage(socketServer, socket, data)
        })
    },

    async sendMessage(socketServer, socket, data) {
        try {
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
                    },
                },
                chat_app_messageimage: data.photos?.map((photo) => {
                    return {
                        id: new Date(Date.now()),
                        image: photo
                    }
                }
            )

            }
            console.log(tempMessage)
            this.newMessage(socketServer, tempMessage)
            if (!data.photos){
                console.log("Saved message without photos")
                await MessageService.createMessage({
                    text: data.text,
                    chat_id: data.chat_id,
                    created_at: new Date(Date.now()),
                    sender_id: socket.data.userId
                })
            }
            
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