import mongoose from "mongoose";
import {ENV} from "../../config/env";
import {logger} from "../../config/logger";

class MongoConnection {
    private readonly uri: string;

    constructor() {
        this.uri = ENV.DB_URI;
    }

    public async connect():Promise<void> {
        try {
            await mongoose.connect(this.uri);
            logger.info("Database connection established successfully.");
        } catch (error) {
            logger.error(`Failed to establish database connection: ${error}`);
            process.exit(1);
        }
    };

    public async shutdown():Promise<void> {
        try {
            await mongoose.connection.close();
            logger.info("Database connection closed successfully.");
        } catch (error) {
            logger.error(`Error during database disconnection: ${error}`);
        }
    };
}

export default MongoConnection;