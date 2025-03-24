import {createClient, RedisClientType} from "redis";
import {ENV} from "../../config/env";
import {logger} from "../../config/logger";

class RedisConnection {
    private static instance: RedisConnection;
    private client: RedisClientType;
    private readonly uri: string;

    private constructor() {
        this.uri = ENV.REDIS_URI;
        this.client = createClient({url: this.uri});

        this.client.on("error", (err) => {
            logger.error(`Redis Client Error: ${err}`);
        });
    }

    public static getInstance(): RedisConnection {
        if (!RedisConnection.instance) {
            RedisConnection.instance = new RedisConnection();
        }
        return RedisConnection.instance;
    }

    public async connect(): Promise<void> {
        try {
            if (!this.client.isOpen) {
                await this.client.connect();
                logger.info("Redis connection established successfully.");
            }
        } catch (error) {
            logger.error(`Failed to establish Redis connection: ${error}`);
            process.exit(1);
        }
    }

    public async shutdown(): Promise<void> {
        try {
            await this.client.disconnect();
            logger.info("Redis connection closed successfully.");
        } catch (error) {
            logger.error(`Error during Redis disconnection: ${error}`);
        }
    }

    public getClient(): RedisClientType {
        return this.client;
    }
}

export default RedisConnection;
