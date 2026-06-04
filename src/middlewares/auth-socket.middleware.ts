import { Socket } from "socket.io";
import { AuthenticationError } from "../errors";
import { verify } from "jsonwebtoken";

export function authSocketMiddleware(
    socket:Socket,
    next:(error?: Error) => void
){
    const authorizationHeaders = socket.handshake.auth.token || socket.handshake.headers.token;
    if (!authorizationHeaders) {
        next(new AuthenticationError("Token is missing in headers."))
        return;
    }
    console.log(authorizationHeaders)
    const [typeToken, token] = authorizationHeaders.split(" ")
    if (typeToken !== 'Bearer' || !token) {
        next(new AuthenticationError("Authorization header is missing or invalid"))
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "fallback_secret";
        const decodedToken = verify(token, secret) as unknown as { id: number, iat: number, exp: number}

        socket.data.userId = decodedToken.id
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        next(new AuthenticationError("Invalid or expired token"))
    }
}