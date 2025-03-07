import { sign, verify } from 'jsonwebtoken';
import {ENV} from "../../config/env";

export class JwtService {
    private static instance: JwtService;
    private readonly secretKey: string = ENV.JWT_SECRET;

    private constructor() {}

    static getInstance(): JwtService {
        if (!JwtService.instance) {
            JwtService.instance = new JwtService();
        }
        return JwtService.instance;
    }

    generateToken(userId: string): string {
        return sign({ userId }, this.secretKey, { expiresIn: '1h' });
    }

    verifyToken(token: string): any {
        try {
            return verify(token, this.secretKey);
        } catch (error) {
            throw new Error('Invalid token');
        }
    }
}
