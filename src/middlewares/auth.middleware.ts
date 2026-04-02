import { Request, Response, NextFunction } from "express";
import { verify } from "jsonwebtoken";
import { AuthenticatedUser } from "../User/user.types";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const authorizationHeaders = req.headers.authorization;
    
    if (!authorizationHeaders) {
        res.status(401).json("Authorization is required. Please, log in");
        return;
    }

    const [typeToken, token] = authorizationHeaders.split(' ');

    if (typeToken !== 'Bearer' || !token) {
        res.status(401).json('Entered wrong token. Please, use Bearer token');
        return;
    }

    try {
        const secret = process.env.JWT_SECRET || "fallback_secret";
        
        const decodedToken = verify(token, secret) as unknown as AuthenticatedUser;
        
        res.locals.userId = decodedToken.id;
        next();
    } catch (error) {
        console.log("JWT Verification Error:", error);
        res.status(401).json('Invalid token. Please, log in again');
    }
}