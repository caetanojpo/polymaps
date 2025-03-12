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
    public readonly create: CreateUserUseCase;
    public readonly find: FindUserUseCase;
    public readonly update: UpdateUserUseCase;
    public readonly delete: DeleteUserUseCase;

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
            const userData = plainToInstance(CreateUserDTO, req.body as object);
            logger.info('Received create user request with data', userData);

            await this.validateErrors(userData, req, res);

            User.validateLocation(userData.address, userData.coordinates);
            const createdUser = await this.create.execute(userData);
            logger.info('User created successfully', {userId: createdUser?._id});

            return res.status(STATUS_CODE.CREATED).json(
                ApiResponse.success(req.t('user.created'), {id: createdUser?._id})
            );
        } catch (error) {
            logger.error('Error creating user', error);
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            logger.info('Received find user by ID request', {userId: id});

            const user = await this.find.executeById(id);
            if (!user) {
                logger.warn('User not found', {userId: id});
                return res.status(STATUS_CODE.NOT_FOUND).json(ApiResponse.error(req.t('user.not_found'), "USER_NOT_FOUND"));
            }

            const mappedUser = UserMapper.toUserResponseFromDomain(user!);
            logger.info('User found', {userId: id, user: mappedUser});

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success(req.t('user.found'), {mappedUser})
            );
        } catch (error) {
            logger.error('Error finding user by ID', error);
            next(error);
        }
    }

    public async findByEmail(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const email = req.params.email;
            logger.info('Received find user by email request', {email});

            const user = await this.find.executeByEmail(email);
            if (!user) {
                logger.warn('User not found', {email});
                return res.status(STATUS_CODE.NOT_FOUND).json(ApiResponse.error(req.t('user.not_found'), "USER_NOT_FOUND"));
            }

            const mappedUser = UserMapper.toUserResponseFromDomain(user!);
            logger.info('User found', {email, user: mappedUser});

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success(req.t('user.found'), {mappedUser})
            );
        } catch (error) {
            logger.error('Error finding user by email', error);
            next(error);
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            logger.info('Received find all users request');

            const users = await this.find.execute();
            const mappedUsers = users.map(user => UserMapper.toUserResponseFromDomain(user!));

            logger.info('Found users', {userCount: mappedUsers.length});

            res.status(STATUS_CODE.OK).json(
                ApiResponse.success(req.t('users.found'), {mappedUsers})
            );
        } catch (error) {
            logger.error('Error finding all users', error);
            next(error);
        }
    }

    public async updateUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const userData = plainToInstance(UpdateUserDTO, req.body as object);

            logger.info('Received update user request', {userId: id, data: userData});

            const errors = await validate(userData);
            if (errors.length > 0) {
                logger.warn('Validation failed', {userId: id, errors});
                return res.status(STATUS_CODE.BAD_REQUEST).json(
                    ApiResponse.error(req.t('validation.failed'), "VALIDATION_ERROR", errors)
                );
            }

            if (userData.coordinates || userData.address) {
                User.validateLocation(userData.address, userData.coordinates, true);
            }

            await this.update.execute(id, userData);
            logger.info('User updated successfully', {userId: id});

            return res.status(STATUS_CODE.NO_CONTENT).send();

        } catch (error) {
            logger.error('Error updating user', error);
            next(error);
        }
    }

    public async deleteUser(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const {hardDelete = false} = req.query as { hardDelete?: boolean };

            logger.info('Received delete user request', {userId: id, hardDelete});

            if (hardDelete) {
                await this.delete.executeHard(id);
                logger.info('User hard deleted', {userId: id});
            } else {
                await this.delete.execute(id);
                logger.info('User soft deleted', {userId: id});
            }

            return res.status(STATUS_CODE.NO_CONTENT).send();
        } catch (error) {
            logger.error('Error deleting user', error);
            next(error);
        }
    }

    private async validateErrors(userData: any, req: Request, res: Response) {
        const errors = await validate(userData);
        if (errors.length > 0) {
            logger.warn("Validation failed for user data", errors.map(err => err.constraints));
            return res.status(STATUS_CODE.BAD_REQUEST).json(ApiResponse.error(req.t('validation.failed'), "VALIDATION_ERROR", errors.map(err => err.constraints)));
        }
    }
}