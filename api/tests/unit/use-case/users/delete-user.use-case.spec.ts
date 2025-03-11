import { DeleteUserUseCase } from "../../../../src/application/use-cases/users/delete-user.use-case";
import { UserRepository } from "../../../../src/infrastructure/database/repositories/user.repository";
import { EntityNotFoundException } from "../../../../src/domain/exceptions/entity-not-found.exception";
import { User } from "../../../../src/domain/models/user.model";

jest.mock("../../../../src/infrastructure/database/repositories/user.repository");

describe("DeleteUserUseCase", () => {
    let deleteUserUseCase: DeleteUserUseCase;
    let userRepository: jest.Mocked<UserRepository>;

    beforeEach(() => {
        userRepository = {
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn(),
        } as unknown as jest.Mocked<UserRepository>;

        deleteUserUseCase = new DeleteUserUseCase(userRepository);
    });

    it("should deactivate a user successfully", async () => {
        const id = "123";
        const user: User = {  name: "Test User", email: "test@example.com", hashedPassword:"Test123!", isActive: true };

        userRepository.findById.mockResolvedValue(user);
        userRepository.update.mockResolvedValue(user);

        await deleteUserUseCase.execute(id);

        expect(userRepository.findById).toHaveBeenCalledWith(id);
        expect(user.isActive).toBe(false);
        expect(userRepository.update).toHaveBeenCalledWith(id, expect.objectContaining({ isActive: false }));
    });

    it("should throw EntityNotFoundException if user does not exist when deactivating", async () => {
        const id = "123";
        userRepository.findById.mockResolvedValue(null);

        await expect(deleteUserUseCase.execute(id)).rejects.toThrow(EntityNotFoundException);
    });

    it("should permanently delete a user successfully", async () => {
        const id = "123";
        const user: User = { name: "Test User",hashedPassword:"Test123!", email: "test@example.com", isActive: true };

        userRepository.findById.mockResolvedValue(user);
        userRepository.delete.mockResolvedValue();

        await deleteUserUseCase.executeHard(id);

        expect(userRepository.findById).toHaveBeenCalledWith(id);
        expect(userRepository.delete).toHaveBeenCalledWith(id);
    });

    it("should throw EntityNotFoundException if user does not exist when deleting permanently", async () => {
        const id = "123";
        userRepository.findById.mockResolvedValue(null);

        await expect(deleteUserUseCase.executeHard(id)).rejects.toThrow(EntityNotFoundException);
    });
});
