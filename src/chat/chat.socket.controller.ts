import { AppError } from "../errors"; 
import { MessageService } from "../message/message.service";
import { ChatService } from "./chat.service";
import { ChatSocketControllerContract } from "./types/chat.contracts";


export const ChatSocketController: ChatSocketControllerContract = {
	registerHandlers(socket){
		socket.on("joinChat", (data, ack) => {
			console.log("join chat")
			ChatSocketController.joinChat(socket, data, ack)
		})
		socket.on("leaveChat", (data) => {
			ChatSocketController.leaveChat(socket, data)
		})
	},
	async joinChat(socket, data, ack) {
		try {
			const isSocketParticipant = await ChatService.isUserChatParticipant(
				data.chatId,
				socket.data.userId,
			);
			console.log("checking over")
			if (isSocketParticipant) {
				console.log("user is participant")

				await socket.join(`chat-${data.chatId}`);
				const messages = await MessageService.markAsRead(data.chatId, socket.data.userId)
				console.log(messages)
				console.log("joined room")

				if (ack) {
					ack({ status: "ok" })
				}
			} else {
				console.log("user is not participant")
				if (ack) {
					ack({
						status: "error",
						message: "you are not chat participant",
					});
				}
			}
		} catch (error) {
			console.log(error);
			if (!ack) return;
			if (error instanceof AppError) {
				ack({
					status: "error",
					message: error.message,
				});
			}
			ack({
				status: "error",
				message: "unknown error",
			});
		}
	},
    leaveChat(socket, data){
		console.log("leave from chat")
        socket.leave(`chat-${data.chatId}`)
    }
};