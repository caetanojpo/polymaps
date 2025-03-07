import {User} from "../../domain/models/user.model";
import {plainToInstance} from 'class-transformer';
import {UserSchema} from "../database/schemas/user.schema";
import {CreateUserDTO} from "../../application/dtos/users/create-user.dto";
import {UserResponseDTO} from "../../application/dtos/users/user-response.dto";
import {UpdateUserDTO} from "../../application/dtos/users/update-user.dto";

export class UserMapper {
    static toSchemaFromDomain(user: User): UserSchema {
        return plainToInstance(UserSchema, user);
    }

    static toDomainFromSchema(userSchema: UserSchema): User {
        return plainToInstance(User, userSchema, {excludeExtraneousValues: true});
    }

    static toDomainFromCreateUserDTO(createUserDto: CreateUserDTO): User {
        return plainToInstance(User, createUserDto);
    }

    static toDomainFromUpdateUserDTO(updateUserDto: UpdateUserDTO): User {
        return plainToInstance(User, updateUserDto);
    }

    static toUserResponseFromDomain(user: User): UserResponseDTO {
        return plainToInstance(UserResponseDTO, user, {excludeExtraneousValues: true});
    }
}