import { Request, Response, NextFunction } from "express";
import RedisConnection from "../cache/redis.client";

const redisInstance = RedisConnection.getInstance();
const redisClient = redisInstance.getClient();

export async function cacheMiddleware(req: Request, res: Response, next: NextFunction) {
    const key = `__express__${req.originalUrl}`;

    try {
        const cachedData = await redisClient.get(key);

        if (cachedData) {
            res.send(JSON.parse(cachedData));
            return;
        } else {
            const originalSend = res.send.bind(res);

            res.send = (body: any): Response => {
                redisClient.set(key, JSON.stringify(body), { EX: 60 }).catch(console.error);
                return originalSend(body);
            };

            next();
        }
    } catch (err) {
        console.error("Cache middleware error:", err);
        next();
    }
}
