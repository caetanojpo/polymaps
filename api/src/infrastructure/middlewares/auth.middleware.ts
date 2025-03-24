import { Request, Response, NextFunction } from 'express';
import { JwtService } from '../services/jwt.service';
import { logger } from "../../config/logger";
import { UserRepository } from "../database/repositories/user.repository";

const jwtService = JwtService.getInstance();
const repository = UserRepository.getInstance();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        logger.error("Authorization token is missing in request headers", {
            method: req.method,
            url: req.originalUrl,
        });
        return res.status(401).json({
            message: 'Unauthorized: Authorization token is missing'
        });
    }

    try {
        const decoded = await jwtService.verifyToken(token);
        const { userId } = decoded;

        if (!userId) {
            logger.error("Decoded token does not contain a valid userId", {
                token,
                method: req.method,
                url: req.originalUrl,
            });
            return res.status(401).json({
                message: 'Unauthorized: Invalid token, no userId found'
            });
        }

        const userFound = await repository.findById(userId);
        if (!userFound?.isActive) {
            logger.error("User with ID does not exist or is inactive", {
                userId,
                method: req.method,
                url: req.originalUrl,
            });
            return res.status(401).json({
                message: 'Unauthorized: User is inactive or does not exist'
            });
        }

        next();
    } catch (error) {
        logger.error("Error verifying token or retrieving user", {
            error: error,
            method: req.method,
            url: req.originalUrl,
        });
        return res.status(401).json({
            message: 'Unauthorized: Error verifying token or retrieving user'
        });
    }
}
