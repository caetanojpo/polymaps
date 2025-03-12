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
            message="errors.location";
            break;
        case "UserException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "USER_ERROR";
            message="errors.user";
            break;
        case "EntityNotFoundException":
            statusCode = STATUS_CODE.NOT_FOUND;
            code = "ENTITY_NOT_FOUND_ERROR";
            message="errors.entity";
            break;
        case "DatabaseException":
            statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
            code = "DATABASE_ERROR";
            message="errors.database";
            break;
        case "CoordinatesException":
            statusCode = STATUS_CODE.BAD_REQUEST;
            code = "COORDINATES_ERROR";
            message="errors.coordinates";
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

    res.status(statusCode).json(ApiResponse.error(req.t(message), code, ENV.NODE_ENV === "dev" ? error.stack : undefined));

    return;
};