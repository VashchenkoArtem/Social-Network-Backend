import { UserSocketControllerContract } from "./user.types"

export const UserSocketController: UserSocketControllerContract = {
    registerHandlers(socket, socketServer) {
        socket.join(`user_${socket.data.userId}`)
        
        socket.on("getUsersOnline", (data, ack) => {
            if (socketServer){
                this.getUsersOnline(socketServer, data, ack)
            }else {
                console.log("socket server is null")
            }
        })        

        socket.on('disconnect', () => {
            socket.leave(`user_${socket.data.userId}`)
        })
    },
    async getUsersOnline(socketServer, data, ack) {
        const checks = await Promise.all(
            data.userIds.map(async (userId) => ({
                userId,
                isOnline: await this.isUserOnline(userId, socketServer)
            }))
        )
        const onlineUsersIds = checks
            .filter(item => item.isOnline)
            .map(item => item.userId)
        if (ack) {
            ack({ onlineUserIds: onlineUsersIds })
        }
    },
    async isUserOnline(userId, socketServer){
        const room = socketServer.sockets.adapter.rooms.has(`user_${userId}`)
        return room
    }
}