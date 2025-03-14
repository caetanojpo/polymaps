import * as bcrypt from "bcrypt";
import {AuthUseCase} from "../../../src/application/use-cases/auth/auth.use-case";
import {UserRepository} from "../../../src/infrastructure/database/repositories/user.repository";
import {JwtService} from "../../../src/infrastructure/services/jwt.service";
import {LoginException} from "../../../src/domain/exceptions/login.exception";
import {LoginResponseDTO} from "../../../src/application/dtos/auth/login-response.dto";

jest.mock("bcrypt");
jest.mock("../../../src/infrastructure/services/jwt.service");

describe("AuthUseCase", () => {
    let authUseCase: AuthUseCase;
    let userRepository: jest.Mocked<UserRepository>;
    let jwtService: jest.Mocked<JwtService>;

    beforeEach(() => {
        userRepository = {
            findByEmail: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        jwtService = {
            generateToken: jest.fn(),
        } as unknown as jest.Mocked<JwtService>;

        (JwtService.getInstance as jest.Mock).mockReturnValue(jwtService);

        authUseCase = new AuthUseCase(userRepository);
    });

    describe("executeHashPassword", () => {
        it("should hash the password correctly", async () => {
            (bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword123");

            const result = await authUseCase.executeHashPassword("myPassword");

            expect(bcrypt.hash).toHaveBeenCalledWith("myPassword", 10);
            expect(result).toBe("hashedPassword123");
        });
    });

    describe("executeValidatePassword", () => {
        it("should validate password correctly", async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);

            const result = await authUseCase.executeValidatePassword("password", "hashedPassword");

            expect(bcrypt.compare).toHaveBeenCalledWith("password", "hashedPassword");
            expect(result).toBe(true);
        });

        it("should return false for invalid password", async () => {
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            const result = await authUseCase.executeValidatePassword("wrongPassword", "hashedPassword");

            expect(result).toBe(false);
        });
    });

    describe("executeLogin", () => {
        const mockUser = {
            _id: "user123",
            name: "test",
            email: "test@test.com",
            hashedPassword: "hashedPassword",
            isActive: true,
        };

        it("should throw an error if user is not found", async () => {
            userRepository.findByEmail.mockResolvedValue(null);

            await expect(authUseCase.executeLogin("test@test.com", "password"))
                .rejects.toThrow(LoginException);

            expect(userRepository.findByEmail).toHaveBeenCalledWith("test@test.com");
        });

        it("should throw an error if user is inactive", async () => {
            userRepository.findByEmail.mockResolvedValue({...mockUser, isActive: false});

            await expect(authUseCase.executeLogin("test@test.com", "password"))
                .rejects.toThrow(LoginException);
        });

        it("should throw an error if password is incorrect", async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(false);

            await expect(authUseCase.executeLogin("test@test.com", "wrongPassword"))
                .rejects.toThrow(LoginException);
        });

        it("should return a LoginResponseDTO for valid credentials", async () => {
            userRepository.findByEmail.mockResolvedValue(mockUser);
            (bcrypt.compare as jest.Mock).mockResolvedValue(true);
            jwtService.generateToken.mockReturnValue("mockToken");

            const result = await authUseCase.executeLogin("test@test.com", "password");

            expect(result).toBeInstanceOf(LoginResponseDTO);
            expect(result.id).toBe("user123");
            expect(result.token).toBe("mockToken");

            expect(jwtService.generateToken).toHaveBeenCalledWith("user123");
        });
    });
});
