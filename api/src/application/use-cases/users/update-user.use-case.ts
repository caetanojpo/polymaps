import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {User} from "../../../domain/models/user.model";
import {UpdateUserDTO} from "../../dtos/users/update-user.dto";
import {UserMapper} from "../../../infrastructure/mapper/user.mapper";
import {AuthUseCase} from "../auth/auth.use-case";
import {logger} from "../../../config/logger";
import {GeoLocationUseCase} from "../geolocation/geo-location.use-case";

export class UpdateUserUseCase {
    private readonly repository: UserRepository;
    private readonly auth: AuthUseCase;
    private readonly geoLocation: GeoLocationUseCase;

    constructor(repository: UserRepository, auth: AuthUseCase) {
        this.repository = repository;
        this.auth = auth;
        this.geoLocation = new GeoLocationUseCase()
    }

    public async execute(id: string, updateUserDTO: UpdateUserDTO): Promise<User | null> {
        const user = UserMapper.toDomainFromUpdateUserDTO(updateUserDTO);
        if (updateUserDTO.password) {
            user.hashedPassword = await this.auth.executeHashPassword(updateUserDTO.password);
            logger.info(`Password hashed: ${user.hashedPassword}`);
        }
        if (user.address || user.coordinates) {
            await this.geoLocation.executeUserValidation(user);
        }
        user.updatedAt = new Date();
        return await this.repository.update(id, user);
    }
}
