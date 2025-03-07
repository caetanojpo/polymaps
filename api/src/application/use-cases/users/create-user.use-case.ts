import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {User} from "../../../domain/models/user.model";
import {CreateUserDTO} from "../../dtos/users/create-user.dto";
import {UserMapper} from "../../../infrastructure/mapper/user.mapper";
import {AuthUseCase} from "../auth/auth.use-case";
import {logger} from "../../../config/logger";

export class CreateUserUseCase {
    private readonly repository: UserRepository;
    private readonly auth: AuthUseCase;

    constructor(repository: UserRepository, auth: AuthUseCase) {
        this.repository = repository;
        this.auth = auth;
    }

    public async execute(createUserDTO: CreateUserDTO): Promise<User | null> {
        const user = UserMapper.toDomainFromCreateUserDTO(createUserDTO);
        user.isActive = true;
        user.hashedPassword = await this.auth.executeHashPassword(createUserDTO.password);
        logger.info(`Password hashed: ${user.hashedPassword}`);
        return await this.repository.save(user);
    }
}
