import {CreateUserUseCase} from "../../../src/application/use-cases/users/create-user.use-case";
import {UserRepository} from "../../../src/infrastructure/database/repositories/user.repository";
import {AuthUseCase} from "../../../src/application/use-cases/auth/auth.use-case";
import {GeoLocationUseCase} from "../../../src/application/use-cases/geolocation/geo-location.use-case";
import {User} from "../../../src/domain/models/user.model";
import {CreateUserDTO} from "../../../src/application/dtos/users/create-user.dto";
import {ValidateLocationException} from "../../../src/domain/exceptions/validate-location.exception";

jest.mock("../../../src/infrastructure/database/repositories/user.repository");
jest.mock("../../../src/application/use-cases/auth/auth.use-case");
jest.mock("../../../src/application/use-cases/geolocation/geo-location.use-case");

describe("CreateUserUseCase", () => {
    let createUserUseCase: CreateUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;
    let authUseCase: jest.Mocked<AuthUseCase>;
    let geoLocationUseCase: jest.Mocked<GeoLocationUseCase>;

    beforeEach(() => {
        userRepository = {
            save: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        authUseCase = {
            executeHashPassword: jest.fn(),
        } as unknown as jest.Mocked<AuthUseCase>;

        geoLocationUseCase = {
            executeUserValidation: jest.fn(),
        } as unknown as jest.Mocked<GeoLocationUseCase>;

        (GeoLocationUseCase as jest.Mock).mockImplementation(() => geoLocationUseCase);

        createUserUseCase = new CreateUserUseCase(userRepository, authUseCase);
    });

    it("should create a user successfully", async () => {
        const dto: CreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "password123",
            address: "ABC 123"
        };
        const hashedPassword = "hashedPassword123";
        authUseCase.executeHashPassword.mockResolvedValue(hashedPassword);

        const user: User = {
            email: dto.email,
            name: dto.name,
            hashedPassword,
            isActive: true,
            address: "ABC 123",
            coordinates: {latitude: 12.34, longitude: 56.78},
        };

        geoLocationUseCase.executeUserValidation.mockImplementation(async (user) => {
            user.coordinates = { latitude: 12.34, longitude: 56.78 };
        });

        userRepository.save.mockResolvedValue(user);

        const result = await createUserUseCase.execute(dto);

        expect(authUseCase.executeHashPassword).toHaveBeenCalledWith(dto.password);
        expect(geoLocationUseCase.executeUserValidation).toHaveBeenCalledWith(expect.objectContaining({email: dto.email}));
        expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({email: dto.email, hashedPassword}));
        expect(result).toEqual(user);
    });

    it("should throw ValidateLocationException if geolocation validation fails", async () => {
        const dto: CreateUserDTO = {email: "test@test.com", name: "test", password: "password123"};
        authUseCase.executeHashPassword.mockResolvedValue("hashedPassword123");
        geoLocationUseCase.executeUserValidation.mockImplementation(async (user) => {
            user.coordinates = { latitude: 12.34, longitude: 56.78 };
        });


        await expect(createUserUseCase.execute(dto)).rejects.toThrow(ValidateLocationException);
    });

    it("should call repository.save() with the correct user object", async () => {
        const dto: CreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "password123",
            address: "ABC 123"
        };
        authUseCase.executeHashPassword.mockResolvedValue("hashedPassword123");

        const user: User = {
            email: dto.email,
            name: dto.name,
            hashedPassword: "hashedPassword123",
            isActive: true,
            address: "ABC 123",
            coordinates: {latitude: 12.34, longitude: 56.78},
        };

        geoLocationUseCase.executeUserValidation.mockImplementation(async (user) => {
            user.coordinates = { latitude: 12.34, longitude: 56.78 };
        });

        userRepository.save.mockResolvedValue(user);

        const result = await createUserUseCase.execute(dto);

        expect(userRepository.save).toHaveBeenCalledWith(expect.objectContaining({email: dto.email}));
        expect(result).toEqual(user);
    });

    it("should throw an error if password hashing fails", async () => {
        const dto: CreateUserDTO = {email: "test@test.com", name:"test", password: "password123"};
        authUseCase.executeHashPassword.mockRejectedValue(new Error("Hashing failed"));

        await expect(createUserUseCase.execute(dto)).rejects.toThrow("Hashing failed");
        expect(userRepository.save).not.toHaveBeenCalled();
    });

    it("should call executeUserValidation() from GeoLocationUseCase", async () => {
        const dto: CreateUserDTO = {
            email: "test@test.com",
            name: "test",
            password: "password123",
            address: "ABC 123"
        };
        authUseCase.executeHashPassword.mockResolvedValue("hashedPassword123");

        geoLocationUseCase.executeUserValidation.mockImplementation(async (user) => {
            user.coordinates = { latitude: 12.34, longitude: 56.78 };
        });

        userRepository.save.mockResolvedValue({name: dto.name, email: dto.email, hashedPassword: "hashedPassword123"});

        await createUserUseCase.execute(dto);

        expect(geoLocationUseCase.executeUserValidation).toHaveBeenCalled();
    });
});
