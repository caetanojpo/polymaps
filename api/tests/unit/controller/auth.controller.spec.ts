import {NextFunction, Request, Response} from "express";
import {logger} from "../../../src/config/logger";
import {ApiResponse} from "../../../src/utils/api-response";
import {LoginRequestDTO} from "../../../src/application/dtos/auth/login-request.dto";
import STATUS_CODE from "../../../src/utils/status-code";
import {plainToInstance} from "class-transformer";
import {validate} from "class-validator";
import {AuthController} from "../../../src/presentation/controllers/auth.controller";

const mockExecuteLogin = jest.fn();
jest.mock("../../../src/application/use-cases/auth/auth.use-case", () => ({
    AuthUseCase: jest.fn().mockImplementation(() => ({
        executeLogin: mockExecuteLogin
    }))
}));
jest.mock("../../../src/infrastructure/database/repositories/user.repository");
jest.mock("../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));
jest.mock("class-validator");

describe("AuthController", () => {
    let authController: AuthController;
    let mockRequest: Partial<Request>;
    let mockResponse: Partial<Response>;
    let mockNext: NextFunction;

    beforeEach(() => {
        jest.clearAllMocks();
        authController = new AuthController();
        mockRequest = {
            body: {}
        };
        mockResponse = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
        mockNext = jest.fn();
    });

    it("should return 400 when validation fails", async () => {
        const errors = [
            {
                constraints: {
                    isEmail: "Invalid email",
                },
            },
        ];
        (validate as jest.Mock).mockResolvedValue(errors);

        const errorConstraints = errors.map(err => err.constraints);

        await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

        expect(validate).toHaveBeenCalledTimes(1);
        expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.BAD_REQUEST);
    });


    it("should return 200 and user data when login is successful", async () => {
        (validate as jest.Mock).mockResolvedValue([]);

        const loginRequestData = plainToInstance(LoginRequestDTO, {
            email: "test@example.com",
            password: "Password123!",
        });

        mockRequest.body = loginRequestData;
        const mockLoggedUser = { id: 1, email: "test@example.com" };

        mockExecuteLogin.mockResolvedValue(mockLoggedUser);

        await authController.login(
            mockRequest as Request,
            mockResponse as Response,
            mockNext
        );

        expect(mockExecuteLogin).toHaveBeenCalledWith(
            "test@example.com",
            "Password123!"
        );

        expect(mockResponse.status).toHaveBeenCalledWith(STATUS_CODE.OK);
    });

    it("should call next with error when login fails", async () => {
        (validate as jest.Mock).mockResolvedValue([]);

        const loginRequestData: LoginRequestDTO = plainToInstance(LoginRequestDTO, {
            email: "test@example.com",
            password: "wrongpassword",
        });

        mockRequest.body = loginRequestData;
        const error = new Error("Invalid credentials");
        mockExecuteLogin.mockRejectedValue(error);

        await authController.login(mockRequest as Request, mockResponse as Response, mockNext);

        expect(validate).toHaveBeenCalled();
        expect(mockExecuteLogin).toHaveBeenCalledWith("test@example.com", "wrongpassword");
        expect(mockNext).toHaveBeenCalledWith(error);
        expect(mockResponse.status).not.toHaveBeenCalled();
        expect(mockResponse.json).not.toHaveBeenCalled();
    });
});
