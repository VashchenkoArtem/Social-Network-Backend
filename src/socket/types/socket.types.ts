import { Server } from "http"
import type { DefaultEventsMap, Socket, Server as SocketServer } from "socket.io"

export interface SocketManagerContract {
    socketServer: SocketServer | null
    initSocketServer: (
        httpServer: Server
    ) => void
}

export type ClientEvents = DefaultEventsMap

export type ServerEvents = DefaultEventsMap

export interface DataSocket {
    userId: number
}

export type AuthenticatedSocket = Socket<
    ClientEvents,
    ServerEvents,
    {},
    DataSocket
>


export type ServerSocket = SocketServer<
    ClientEvents,
    ServerEvents,
    {},
    DataSocket
>