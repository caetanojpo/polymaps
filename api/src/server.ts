import {logger} from "./config/logger";
import {Application} from "express";
import MongoConnection from "./infrastructure/database/mongo.connection";

class Server {
    private app: Application;
    private readonly port: string;
    private database: MongoConnection;

    constructor(app: Application, port: string) {
        this.app = app;
        this.port = port;
        this.database = new MongoConnection();
    }

    public async start(): Promise<void> {
        try {
            await this.database.connect();
            const server = this.app.listen(this.port, () => {
                logger.info(`Server is up and running on port ${this.port}`);
            });

            this.setupGracefulShutdown(server);
        } catch (error) {
            logger.error(`Server startup failed: ${error}`);
            process.exit(1);
        }
    }

    private setupGracefulShutdown(server: any): void {
        process.on('SIGTERM', () => this.handleShutdown('SIGTERM', server));
        process.on('SIGINT', () => this.handleShutdown('SIGINT', server));

        process.on('unhandledRejection', (error: Error) => {
            logger.error(`Unhandled Promise Rejection: ${error.message}`, {stack: error.stack});
            this.shutdownApp(server);
        });

        process.on('uncaughtException', (error: Error) => {
            logger.error(`Uncaught Exception: ${error.message}`, {stack: error.stack});
            this.shutdownApp(server);
        });
    }

    private handleShutdown(signal: string, server: any): void {
        logger.info(`Received ${signal}. Initiating graceful shutdown...`);

        server.close(async () => {
            logger.info('HTTP server successfully closed.');
            await this.database.shutdown();
            process.exit(0);
        });

        setTimeout(() => {
            logger.error('Timeout reached. Forcing shutdown...');
            process.exit(1);
        }, 5000);
    }

    private shutdownApp(server: any): void {
        logger.error('Shutting down application due to an unhandled error');
        server.close(() => process.exit(1));
    }
}

export default Server;