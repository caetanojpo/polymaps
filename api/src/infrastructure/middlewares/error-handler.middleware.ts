import {Request, Response, NextFunction} from "express";
import {logger} from "../../config/logger";
import {ENV} from "../../config/env";
import STATUS_CODE from "../../utils/status-code.utils";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
    let {statusCode, message} = error;

    logger.info("passou aqui")
    if (!statusCode) {
        statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;
    }

    if (!error.isOperational) {
        message = message || 'Internal Server Error';
    }

    if (error.name === 'ValidationError') {
        statusCode = STATUS_CODE.BAD_REQUEST;
        message = 'Validation error occurred';
    }

    const responsePayload = {
        status: 'error',
        message,
        errorCode: error.code || 'UNKNOWN_ERROR',
        ...(ENV.NODE_ENV === 'dev' && {stack: error.stack})
    };

    if (error.isOperational) {
        logger.error({
            message: error.message,
            stack: error.stack,
            statusCode: statusCode,
            url: req.originalUrl,
            method: req.method,
            body: req.body,
        });
    }

    res.status(statusCode).json(responsePayload);
};