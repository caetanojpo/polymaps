import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {User} from "../../../domain/models/user.model";
import {CreateUserDTO} from "../../dtos/users/create-user.dto";
import {UserMapper} from "../../../infrastructure/mapper/user.mapper";
import {AuthUseCase} from "../auth/auth.use-case";
import {logger} from "../../../config/logger";
import {ValidateLocationException} from "../../../domain/exceptions/validate-location.exception";
import {GeoLocationUseCase} from "../geolocation/geo-location.use-case";

export class CreateUserUseCase {
    private readonly repository: UserRepository;
    private readonly auth: AuthUseCase;
    private readonly geoLocation: GeoLocationUseCase;

    constructor(repository: UserRepository, auth: AuthUseCase) {
        this.repository = repository;
        this.auth = auth;
        this.geoLocation = new GeoLocationUseCase()
    }

    public async execute(createUserDTO: CreateUserDTO): Promise<User | null> {
        const user = UserMapper.toDomainFromCreateUserDTO(createUserDTO);
        user.isActive = true;
        user.hashedPassword = await this.auth.executeHashPassword(createUserDTO.password);
        await this.geoLocation.executeUserValidation(user);
        if (!user.address || !user.coordinates) {
            throw new ValidateLocationException(`Failed to validate location. Address: ${user.address}, Coordinates: ${user.coordinates}`);
        }
        logger.info(`Password hashed: ${user.hashedPassword}`);
        return await this.repository.save(user);
    }
}
