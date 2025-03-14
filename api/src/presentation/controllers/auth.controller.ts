import {UserRepository} from "../../infrastructure/database/repositories/user.repository";
import {AuthUseCase} from "../../application/use-cases/auth/auth.use-case";
import {NextFunction, Request, Response} from "express";
import {logger} from "../../config/logger";
import {plainToInstance} from "class-transformer";
import STATUS_CODE from "../../utils/status-code";
import {ApiResponse} from "../../utils/api-response";
import {LoginRequestDTO} from "../../application/dtos/auth/login-request.dto";
import {validate} from "class-validator";
import {LoginResponseDTO} from "../../application/dtos/auth/login-response.dto";

export class AuthController {
    private readonly auth: AuthUseCase;

    constructor() {
        const userRepository = UserRepository.getInstance();
        this.auth = new AuthUseCase(userRepository);
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        logger.info("Received login request", {email: req.body.email});
        try {
            const loginData = plainToInstance(LoginRequestDTO, req.body as object);

            const hasErrors = await this.validateErrors(loginData, req, res);
            if (hasErrors) return;

            const loggedUser: LoginResponseDTO = await this.auth.executeLogin(
                loginData.email,
                loginData.password
            );

            logger.info("User logged in successfully", {email: loginData.email});
            res.status(STATUS_CODE.OK).json(ApiResponse.success(req.t("auth.logged"), loggedUser));
        } catch (error) {
            logger.error("Login process failed", {error: error});
            next(error);
        }
    }

    private async validateErrors(loginData: any, req: Request, res: Response): Promise<boolean> {
        const errors = await validate(loginData);
        if (errors.length > 0) {
            logger.warn("Validation failed for user data", {
                email: loginData.email,
                errors: errors.map(err => err.constraints),
            });
            res.status(STATUS_CODE.BAD_REQUEST).json(
                ApiResponse.error(req.t("validation.failed"), "VALIDATION_ERROR", errors.map(err => err.constraints))
            );
            return true;
        }
        return false;
    }
}

