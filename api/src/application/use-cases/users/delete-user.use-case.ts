import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {EntityNotFoundException} from "../../../domain/exceptions/entity-not-found.exception";

export class DeleteUserUseCase {
    private readonly repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    public async execute(id: string): Promise<void> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new EntityNotFoundException("User", id);
        }
        user.isActive = false;
        await this.repository.update(id, user);
    }

    public async executeHard(id: string): Promise<void> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new EntityNotFoundException("User", id);
        }
        return await this.repository.delete(id);
    }
}
