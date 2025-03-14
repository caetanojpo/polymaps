import {Request, Response, NextFunction} from "express";
import {logger} from "../../config/logger";
import {ENV} from "../../config/env";
import STATUS_CODE from "../../utils/status-code";
import {ApiResponse} from "../../utils/api-response";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    let {statusCode, message, code} = error;

    statusCode = statusCode || STATUS_CODE.INTERNAL_SERVER_ERROR;
    message = message || 'Internal Server Error';

    switch (error.name) {
        case "ValidateLocationException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "VALIDATION_ERROR";
            break;
        case "UserException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "USER_ERROR";
            break;
        case "EntityNotFoundException":
            statusCode = STATUS_CODE.NOT_FOUND;
            code = "ENTITY_NOT_FOUND_ERROR";
            break;
        case "DatabaseException":
            statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
            code = "DATABASE_ERROR";
            break;
        case "CoordinatesException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "COORDINATES_ERROR";
            break;
        case "LoginException":
            statusCode = STATUS_CODE.UNAUTHORIZED;
            code = "LOGIN_ERROR";
            break;
        case "RegionException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "REGION_ERROR";
            break;
        default:
            code = code || error.errorCode || "UNKNOWN_ERROR";
    }

    logger.error(`Error: ${message}`, {
        statusCode,
        url: req.originalUrl,
        method: req.method,
        body: req.body,
        errorCode: code,
    });

    if (res.headersSent) {
        return next(error);
    }

    res.status(statusCode).json(ApiResponse.error(message, code, ENV.NODE_ENV === "dev" ? error.stack : undefined));

    return;
};