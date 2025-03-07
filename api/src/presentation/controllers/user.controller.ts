import {CreateUserUseCase} from "../../application/use-cases/users/create-user.use-case";
import {UserRepository} from "../../infrastructure/database/repositories/user.repository";
import {CreateUserDTO} from "../../application/dtos/users/create-user.dto";
import {plainToInstance} from "class-transformer";
import {logger} from "../../config/logger";
import STATUS_CODE from "../../utils/status-code";
import {validate} from "class-validator";
import {NextFunction, Request, Response} from "express";
import {User} from "../../domain/models/user.model";
import {ApiResponse} from "../../utils/api-response";
import {AuthUseCase} from "../../application/use-cases/auth/auth.use-case";

export class UserController {
    private create: CreateUserUseCase;

    constructor() {
        const userRepository = UserRepository.getInstance();
        const auth = new AuthUseCase(userRepository);
        this.create = new CreateUserUseCase(userRepository, auth);
    }

    public async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("User creation process started");
            const userData = plainToInstance(CreateUserDTO, req.body as object);

            const errors = await validate(userData);
            if (errors.length > 0) {
                logger.warn("Validation failed for user data", errors.map(err => err.constraints))
                return res.status(STATUS_CODE.BAD_REQUEST).json(ApiResponse.error("Validation failed", "VALIDATION_ERROR", errors.map(err => err.constraints)));
            }

            User.validateLocation(userData.address, userData.coordinates);
            const createdUser = await this.create.execute(userData);

            logger.info(`User created successfully with ID: ${createdUser?._id}`);

            res.status(STATUS_CODE.CREATED).json(
                ApiResponse.success("User created successfully", {id: createdUser?._id})
            );
        } catch (error) {
            next(error);
        }
    }
}