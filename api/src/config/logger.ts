import winston from "winston";
import {ENV} from "./env";

const levels = {
    error: 0,
    warn: 1,
    info: 2,
    http: 3,
    debug: 4,
};

const colors = {
    error: "red",
    warn: "yellow",
    info: "green",
    http: "magenta",
    debug: "white",
};

winston.addColors(colors);

const logFormat = winston.format.combine(
    winston.format.timestamp({format: "YYYY-MM-DD HH:mm:ss"}),
    winston.format.errors({stack: true}),
    winston.format.printf((info) => {
        const timestamp = info.timestamp || new Date().toISOString();
        const level = info.level?.toUpperCase() || "INFO";
        const message = info.message || "";

        if (typeof info.stack === "string" && info.stack.includes("\n")) {
            return `[${timestamp}] ${level}: ${message}\n  ↳ ${info.stack.split("\n")[1].trim()}`;
        }

        return `[${timestamp}] ${level}: ${message}`;
    })
);

const transports = [
    new winston.transports.Console({
        format: winston.format.combine(
            winston.format.colorize({message: true}),
            logFormat
        ),
    }),
    new winston.transports.File({
        filename: "logs/app.log",
        format: logFormat,
    }),
    new winston.transports.File({
        level: "error",
        filename: "logs/error.log",
        format: logFormat,
    }),
];

const baseLogger = winston.createLogger({
    level: ENV.NODE_ENV === "dev" ? "debug" : "info",
    levels,
    format: logFormat,
    transports,
});

/**
 * Logs a formatted message, replacing `{}` placeholders with arguments.
 * @example logger.logFormatted("info", "User {} logged in.", userEmail);
 */
const logFormatted = (
    level: keyof typeof levels,
    message: string,
    ...args: any[]
) => {
    const formattedMessage = args.length
        ? message.replace(/{}/g, () => args.shift())
        : message;
    baseLogger.log(level, formattedMessage);
};

export const logger = Object.assign(baseLogger, {logFormatted});
