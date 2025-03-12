import {UpdateUserUseCase} from "../../../../src/application/use-cases/users/update-user.use-case";
import {UserRepository} from "../../../../src/infrastructure/database/repositories/user.repository";
import {AuthUseCase} from "../../../../src/application/use-cases/auth/auth.use-case";
import {GeoLocationUseCase} from "../../../../src/application/use-cases/geolocation/geo-location.use-case";
import {User} from "../../../../src/domain/models/user.model";
import {UpdateUserDTO} from "../../../../src/application/dtos/users/update-user.dto";
import {UserMapper} from "../../../../src/infrastructure/mapper/user.mapper";

jest.mock("../../../../src/infrastructure/database/repositories/user.repository");
jest.mock("../../../../src/application/use-cases/auth/auth.use-case");
jest.mock("../../../../src/application/use-cases/geolocation/geo-location.use-case");
jest.mock("../../../../src/infrastructure/mapper/user.mapper");
jest.mock("../../../../src/config/logger", () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

describe("UpdateUserUseCase", () => {
    let updateUserUseCase: UpdateUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;
    let authUseCase: jest.Mocked<AuthUseCase>;
    let geoLocationUseCase: jest.Mocked<GeoLocationUseCase>;

    beforeEach(() => {
        userRepository = {
            update: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        authUseCase = {
            executeHashPassword: jest.fn(),
        } as unknown as jest.Mocked<AuthUseCase>;

        geoLocationUseCase = {
            executeUserValidation: jest.fn(),
        } as unknown as jest.Mocked<GeoLocationUseCase>;

        updateUserUseCase = new UpdateUserUseCase(userRepository, authUseCase);
        (updateUserUseCase as any).geoLocation = geoLocationUseCase; // Mocking GeoLocationUseCase inside UpdateUserUseCase
    });

    it("should update user successfully without changing password", async () => {
        const id = "123";
        const updateUserDTO: UpdateUserDTO = {
            name: "Updated Name",
            email: "user1@example.com", password: "newPassword!15", address: "Updated Address"
        };

        const user: User = {
            email: "test@example.com",
            name: "Updated Name",
            hashedPassword: "oldHashedPassword",
            isActive: true,
            address: "Updated Address",
            coordinates: {latitude: 12.34, longitude: 56.78},
            updatedAt: new Date(),
        };

        (UserMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(user);
        userRepository.update.mockResolvedValue(user);

        const result = await updateUserUseCase.execute(id, updateUserDTO);

        expect(userRepository.update).toHaveBeenCalledWith(id, expect.objectContaining({name: updateUserDTO.name}));
        expect(result).toEqual(user);
    });

    it("should hash password when updating user", async () => {
        const id = "123";
        const updateUserDTO: UpdateUserDTO = {
            email: "user1@example.com", name: "User One",
            password: "newPassword"
        };

        const user: User = {
            email: "test@example.com",
            name: "Test User",
            hashedPassword: "oldHashedPassword",
            isActive: true,
            updatedAt: new Date(),
        };

        const hashedPassword = "hashedNewPassword";
        authUseCase.executeHashPassword.mockResolvedValue(hashedPassword);
        (UserMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(user);
        userRepository.update.mockResolvedValue(user);

        await updateUserUseCase.execute(id, updateUserDTO);

        expect(authUseCase.executeHashPassword).toHaveBeenCalledWith(updateUserDTO.password);
        expect(userRepository.update).toHaveBeenCalledWith(id, expect.objectContaining({hashedPassword}));
    });

    it("should validate location if address or coordinates are updated", async () => {
        const id = "123";
        const updateUserDTO: UpdateUserDTO = {
            email: "user1@example.com", name: "User One", password: "newPassword",
            address: "New Address"
        };

        const user: User = {
            email: "test@example.com",
            name: "Test User",
            hashedPassword: "oldHashedPassword",
            isActive: true,
            address: "New Address",
            coordinates: {latitude: 12.34, longitude: 56.78},
            updatedAt: new Date(),
        };

        (UserMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(user);
        userRepository.update.mockResolvedValue(user);

        await updateUserUseCase.execute(id, updateUserDTO);

        expect(geoLocationUseCase.executeUserValidation).toHaveBeenCalledWith(user);
    });
});
