import {User} from "../models/user.model";

export interface IUserRepository {
    findById(id: string): Promise<User | null>;

    findByEmail(email: string): Promise<User | null>;

    save(user: User): Promise<User>;

    update(id: string, userData: User): Promise<User | null>;

    delete(id: string): Promise<boolean>;
}