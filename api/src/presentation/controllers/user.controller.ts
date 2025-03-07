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
import {FindUserUseCase} from "../../application/use-cases/users/find-user.use-case";
import {UserMapper} from "../../infrastructure/mapper/user.mapper";
import {UpdateUserDTO} from "../../application/dtos/users/update-user.dto";
import {UpdateUserUseCase} from "../../application/use-cases/users/update-user.use-case";
import {DeleteUserUseCase} from "../../application/use-cases/users/delete-user.use-case";

export class UserController {
    private create: CreateUserUseCase;
    private find: FindUserUseCase;
    private update: UpdateUserUseCase;
    private delete: DeleteUserUseCase;

    constructor() {
        const userRepository = UserRepository.getInstance();
        const auth = new AuthUseCase(userRepository);
        this.create = new CreateUserUseCase(userRepository, auth);
        this.find = new FindUserUseCase(userRepository);
        this.update = new UpdateUserUseCase(userRepository, auth);
        this.delete = new DeleteUserUseCase(userRepository);
    }

    public async createUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("User creation process started");
            const userData = plainToInstance(CreateUserDTO, req.body as object);

            await this.validateErrors(userData, res);

            User.validateLocation(userData.address, userData.coordinates);
            const createdUser = await this.create.execute(userData);

            logger.info(`User created successfully with ID: ${createdUser?._id}`);

            return res.status(STATUS_CODE.CREATED).json(
                ApiResponse.success("User created successfully", {id: createdUser?._id})
            );
        } catch (error) {
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("Finding user by id process started");
            const id = req.params.id;

            const user = await this.find.executeById(id);

            logger.info(`User found!`);

            const mappedUser = UserMapper.toUserResponseFromDomain(user!);

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success("User found", {mappedUser})
            );
        } catch (error) {
            next(error);
        }
    }

    public async findByEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("Finding user by email process started");
            const email = req.params.email;

            const user = await this.find.executeByEmail(email);

            logger.info(`User found!`);

            const mappedUser = UserMapper.toUserResponseFromDomain(user!);

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success("User found", {mappedUser})
            );
        } catch (error) {
            next(error);
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("Finding all users process started");

            const users = await this.find.execute();

            logger.info(`Users found!`);

            const mappedUsers = users.map(user => UserMapper.toUserResponseFromDomain(user!));

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success("Users not found", {mappedUsers})
            );
        } catch (error) {
            next(error);
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("User update process started");
            const id = req.params.id;
            const userData = plainToInstance(UpdateUserDTO, req.body as object);

            await this.validateErrors(userData, res);

            User.validateLocation(userData.address, userData.coordinates, true);
            const updatedUser = await this.update.execute(id, userData);

            logger.info(`User updated successfully with ID: ${updatedUser?._id}`);

            return res.status(STATUS_CODE.NO_CONTENT).json(
                ApiResponse.success("User updated successfully", {id: updatedUser?._id})
            );
        } catch (error) {
            next(error);
        }
    }

    public async softDeleteUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("User soft delete process started");
            const id = req.params.id;
            await this.delete.execute(id);
            logger.info(`User soft deleted successfully with ID: ${id}`);

            return res.status(STATUS_CODE.NO_CONTENT).json(
                ApiResponse.success("User deleted successfully")
            );
        } catch (error) {
            next(error);
        }
    }

    public async hardDeleteUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info("User hard delete process started");
            const id = req.params.id;
            await this.delete.executeHard(id);
            logger.info(`User hard deleted successfully with ID: ${id}`);

            return res.status(STATUS_CODE.NO_CONTENT).json(
                ApiResponse.success("User deleted successfully")
            );
        } catch (error) {
            next(error);
        }
    }

    private async validateErrors(userData: any, res: Response) {
        const errors = await validate(userData);
        if (errors.length > 0) {
            logger.warn("Validation failed for user data", errors.map(err => err.constraints))
            return res.status(STATUS_CODE.BAD_REQUEST).json(ApiResponse.error("Validation failed", "VALIDATION_ERROR", errors.map(err => err.constraints)));
        }
    }
}