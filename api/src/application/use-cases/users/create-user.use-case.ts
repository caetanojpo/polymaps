import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {User} from "../../../domain/models/user.model";
import {CreateUserDTO} from "../../dtos/users/create-user.dto";
import {UserMapper} from "../../../infrastructure/mapper/user.mapper";

export class CreateUserUseCase {
    private readonly repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    public async execute(createUserDTO: CreateUserDTO): Promise<User | null> {
        const user = UserMapper.toDomainFromCreateUserDTO(createUserDTO);
        user.isActive = true;
        user.hashedPassword = createUserDTO.password;
        return await this.repository.save(user);
    }
}
