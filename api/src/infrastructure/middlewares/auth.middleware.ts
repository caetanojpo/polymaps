import {Request, Response, NextFunction} from 'express';
import {JwtService} from '../services/jwt.service';
import {logger} from "../../config/logger";
import {UserRepository} from "../database/repositories/user.repository";

const jwtService = JwtService.getInstance();
const repository = UserRepository.getInstance();

export async function authMiddleware(req: Request, res: Response, next: NextFunction) {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        logger.error("Invalid token");
        return res.status(401).json({message: 'Unauthorized'});
    }

    try {
        const decoded = await jwtService.verifyToken(token);
        const {userId} = decoded;
        if (!userId) {
            logger.error( "Invalid token");
            return res.status(401).json({message: 'Invalid token'});
        }

        const userFound = await repository.findById(userId);

        if (!userFound?.isActive) {
            logger.error("Invalid token");
            return res.status(401).json({message: 'Invalid token'});
        }

        next();
    } catch (error) {
        return res.status(401).json({message: 'Invalid token'});
    }
}