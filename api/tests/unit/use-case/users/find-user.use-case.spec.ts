import {FindUserUseCase} from "../../../../src/application/use-cases/users/find-user.use-case";
import {UserRepository} from "../../../../src/infrastructure/database/repositories/user.repository";
import {EntityNotFoundException} from "../../../../src/domain/exceptions/entity-not-found.exception";
import {User} from "../../../../src/domain/models/user.model";

jest.mock("../../../../src/infrastructure/database/repositories/user.repository");

describe("FindUserUseCase", () => {
    let findUserUseCase: FindUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            findByEmail: jest.fn(),
            findAll: jest.fn()
        } as unknown as jest.Mocked<UserRepository>;

        findUserUseCase = new FindUserUseCase(userRepository);
    });

    it("should return a user by ID successfully", async () => {
        const user: User = {email: "test@example.com", name: "Test User"} as User;
        userRepository.findById.mockResolvedValue(user);

        const result = await findUserUseCase.executeById("1");

        expect(userRepository.findById).toHaveBeenCalledWith("1");
        expect(result).toEqual(user);
    });

    it("should throw EntityNotFoundException if user by ID is not found", async () => {
        userRepository.findById.mockResolvedValue(null);

        await expect(findUserUseCase.executeById("1")).rejects.toThrow(EntityNotFoundException);
    });

    it("should return a user by email successfully", async () => {
        const user: User = {email: "test@example.com", name: "Test User"} as User;
        userRepository.findByEmail.mockResolvedValue(user);

        const result = await findUserUseCase.executeByEmail("test@example.com");

        expect(userRepository.findByEmail).toHaveBeenCalledWith("test@example.com");
        expect(result).toEqual(user);
    });

    it("should throw EntityNotFoundException if user by email is not found", async () => {
        userRepository.findByEmail.mockResolvedValue(null);

        await expect(findUserUseCase.executeByEmail("test@example.com")).rejects.toThrow(EntityNotFoundException);
    });

    it("should return all users successfully", async () => {
        const users: User[] = [
            {email: "user1@example.com", name: "User One"},
            {email: "user2@example.com", name: "User Two"}
        ] as User[];
        userRepository.findAll.mockResolvedValue(users);

        const result = await findUserUseCase.execute();

        expect(userRepository.findAll).toHaveBeenCalled();
        expect(result).toEqual(users);
    });
});
