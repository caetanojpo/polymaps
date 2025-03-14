import {config} from "dotenv";

config();

export const ENV = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || "dev",
    LOG_LEVEL: process.env.LOG_LEVEL || "info",
    ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS || "*",
    DB_URI: process.env.DB_URI || "mongodb://localhost:27017",
    JWT_SECRET: process.env.JWT_SECRET || "",
    REDIS_URI: process.env.REDIS_URI || "redis://localhost:6379",
};
