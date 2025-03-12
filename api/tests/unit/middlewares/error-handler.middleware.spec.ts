import {Request, Response} from 'express';
import STATUS_CODE from "../../../src/utils/status-code";
import {errorHandler} from "../../../src/infrastructure/middlewares/error-handler.middleware";
import {logger} from "../../../src/config/logger";
import {ApiResponse} from "../../../src/utils/api-response";


jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));
describe('Error Handler Middleware', () => {
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;

    beforeEach(() => {
        req = {
            originalUrl: '/test-url',
            method: 'POST',
            body: {test: 'data'},
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn().mockReturnThis(),
        };

        next = jest.fn();
    });

    it('should handle ValidateLocationException correctly', () => {
        const error = new Error('Invalid location') as any;
        error.name = 'ValidateLocationException';
        error.statusCode = STATUS_CODE.BAD_REQUEST;

        errorHandler(error, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error: Invalid location',
            expect.objectContaining({
                statusCode: STATUS_CODE.BAD_REQUEST,
                url: '/test-url',
                method: 'POST',
                body: {test: 'data'},
                errorCode: 'VALIDATION_ERROR',
            })
        );

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.error('Invalid location', 'VALIDATION_ERROR', undefined)
        );
    });

    it('should handle UserException correctly', () => {
        const error = new Error('User not found') as any;
        error.name = 'UserException';
        error.statusCode = STATUS_CODE.BAD_REQUEST;

        errorHandler(error, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error: User not found',
            expect.objectContaining({
                statusCode: STATUS_CODE.BAD_REQUEST,
                url: '/test-url',
                method: 'POST',
                body: {test: 'data'},
                errorCode: 'USER_ERROR',
            })
        );

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.error('User not found', 'USER_ERROR', undefined)
        );
    });

    it('should handle EntityNotFoundException correctly', () => {
        const error = new Error('Entity not found') as any;
        error.name = 'EntityNotFoundException';
        error.statusCode = STATUS_CODE.NOT_FOUND;

        errorHandler(error, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error: Entity not found',
            expect.objectContaining({
                statusCode: STATUS_CODE.NOT_FOUND,
                url: '/test-url',
                method: 'POST',
                body: {test: 'data'},
                errorCode: 'ENTITY_NOT_FOUND_ERROR',
            })
        );

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.NOT_FOUND);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.error('Entity not found', 'ENTITY_NOT_FOUND_ERROR', undefined)
        );
    });

    it('should handle DatabaseException correctly', () => {
        const error = new Error('Database error') as any;
        error.name = 'DatabaseException';
        error.statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        errorHandler(error, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error: Database error',
            expect.objectContaining({
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
                url: '/test-url',
                method: 'POST',
                body: {test: 'data'},
                errorCode: 'DATABASE_ERROR',
            })
        );

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.error('Database error', 'DATABASE_ERROR', undefined)
        );
    });

    it('should handle default error correctly', () => {
        const error = new Error('Some unknown error') as any;
        error.statusCode = STATUS_CODE.INTERNAL_SERVER_ERROR;

        errorHandler(error, req as Request, res as Response, next);

        expect(logger.error).toHaveBeenCalledWith(
            'Error: Some unknown error',
            expect.objectContaining({
                statusCode: STATUS_CODE.INTERNAL_SERVER_ERROR,
                url: '/test-url',
                method: 'POST',
                body: {test: 'data'},
                errorCode: 'UNKNOWN_ERROR',
            })
        );

        expect(res.status).toHaveBeenCalledWith(STATUS_CODE.INTERNAL_SERVER_ERROR);
        expect(res.json).toHaveBeenCalledWith(
            ApiResponse.error('Some unknown error', 'UNKNOWN_ERROR', undefined)
        );
    });

    it('should call next if headers have already been sent', () => {
        res.headersSent = true;

        const error = new Error('Headers already sent') as any;

        errorHandler(error, req as Request, res as Response, next);

        expect(next).toHaveBeenCalledWith(error);
    });
});
