import { ChatSocketController } from "../chat/chat.socket.controller";
import { client } from "../client/client";
import { MessageSocketController } from "../message/message.socket.controller";
import { authSocketMiddleware } from "../middlewares/auth-socket.middleware";
import { UserSocketController } from "../user/user.socket.controller";
import { AuthenticatedSocket, ServerSocket, SocketManagerContract } from "./socket.types";
import { Server as SocketServer } from "socket.io"


export const SocketManager: SocketManagerContract = {
    socketServer: null,
    initSocketServer(httpServer) {
        this.socketServer = new SocketServer<ServerSocket>(httpServer, {
            cors: {
                origin: "*",
                methods: ['POST', 'GET'],
                credentials: true,
            },
            maxHttpBufferSize: 100 * 1024 * 1024
        })
        this.socketServer.use(authSocketMiddleware)
        this.socketServer.on("connection", async (socket: AuthenticatedSocket) => {
            const userId = socket.data.userId;
            
            console.log("Connected", userId);
            
            UserSocketController.registerHandlers(socket, this.socketServer)

            if (this.socketServer) {
                ChatSocketController.registerHandlers(socket, this.socketServer);
                MessageSocketController.registerHandlers(this.socketServer, socket);
            }

            socket.on("disconnect", async () => {
                console.log("Disconnected", userId);
            });
        });
    }
}