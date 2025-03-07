import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {User} from "../../../domain/models/user.model";
import {EntityNotFoundException} from "../../../domain/exceptions/entity-not-found.exception";

export class FindUserUseCase {
    private readonly repository: UserRepository;

    constructor(repository: UserRepository) {
        this.repository = repository;
    }

    public async executeById(id: string): Promise<User | null> {
        const user = await this.repository.findById(id);
        if (!user) {
            throw new EntityNotFoundException("User", id);
        }
        return user;
    }

    public async executeByEmail(email: string): Promise<User | null> {
        const user = await this.repository.findByEmail(email);
        if (!user) {
            throw new EntityNotFoundException("User");
        }
        return user;
    }

    public async execute(): Promise<User[]> {
        return await this.repository.findAll();
    }
}