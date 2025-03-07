import {CreateUserUseCase} from "../../application/use-cases/users/create-user.use-case";
import {FindUserUseCase} from "../../application/use-cases/users/find-user.use-case";
import {UpdateUserUseCase} from "../../application/use-cases/users/update-user.use-case";
import {DeleteUserUseCase} from "../../application/use-cases/users/delete-user.use-case";
import {UserRepository} from "../../infrastructure/database/repositories/user.repository";
import {AuthUseCase} from "../../application/use-cases/auth/auth.use-case";
import {NextFunction, Request, Response} from "express";
import {logger} from "../../config/logger";
import {plainToInstance} from "class-transformer";
import STATUS_CODE from "../../utils/status-code";
import {ApiResponse} from "../../utils/api-response";
import {LoginRequestDTO} from "../../application/dtos/auth/login-request.dto";
import {validate} from "class-validator";

export class AuthController {
    private readonly auth: AuthUseCase;

    constructor() {
        const userRepository = UserRepository.getInstance();
        this.auth = new AuthUseCase(userRepository);
    }

    public async login(req: Request, res: Response, next: NextFunction): Promise<any> {
        const loginData = plainToInstance(LoginRequestDTO, req.body as object);
        const errors = await validate(loginData);
        if (errors.length > 0) {
            logger.warn("Validation failed for user data", errors.map(err => err.constraints))
            return res.status(STATUS_CODE.BAD_REQUEST).json(ApiResponse.error("Validation failed", "VALIDATION_ERROR", errors.map(err => err.constraints)));
        }

        try {
            const loggedUser = await this.auth.executeLogin(
                loginData.email,
                loginData.password
            );
            res.status(STATUS_CODE.OK).json(
                ApiResponse.success("User logged in", loggedUser)
            );
        } catch (error) {
            next(error);
        }
    }
}

