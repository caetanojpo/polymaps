import {User} from "../../../domain/models/user.model";
import {IUserRepository} from "../../../domain/repositories/iuser.repository";
import {UserModel} from "../schemas/user.schema";
import {UserMapper} from "../../mapper/user.mapper";
import {DatabaseException} from "../../../domain/exceptions/database.exception";

export class UserRepository implements IUserRepository {
    private static instance: UserRepository;
    private readonly collection: typeof UserModel;

    constructor() {
        this.collection = UserModel;
    }

    public static getInstance(): UserRepository {
        if (!UserRepository.instance) {
            UserRepository.instance = new UserRepository();
        }
        return UserRepository.instance;
    }

    public async findById(id: string): Promise<User | null> {
        try {
            const userDocument = await this.collection.findById(id).lean().exec();
            return userDocument ? UserMapper.toDomainFromSchema(userDocument) : null;
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to find user by id: ${id} - ` + error
            );
        }
    }

    public async findByEmail(email: string): Promise<User | null> {
        try {
            const userDocument = await this.collection.findOne({email}).lean().exec();
            return userDocument ? UserMapper.toDomainFromSchema(userDocument) : null;
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to find user by email: ${email} - ` + error
            );
        }
    }

    public async findAll(): Promise<User[]> {
        try {
            const users = await this.collection.find().lean().exec();
            return users.map((user) => UserMapper.toDomainFromSchema(user));
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to fetch all users - ` + error
            );
        }
    }

    public async save(user: User): Promise<User> {
        try {
            const userDocument = new this.collection(UserMapper.toSchemaFromDomain(user));
            await userDocument.save();
            return UserMapper.toDomainFromSchema(userDocument);
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to save user: ${JSON.stringify(user)} - ` + error
            );
        }
    }

    public async update(id: string, userData: User): Promise<User | null> {
        try {
            const updatedUser = await this.collection.findByIdAndUpdate(
                id,
                {$set: UserMapper.toSchemaFromDomain(userData)},
                {new: true, runValidators: true}
            ).lean().exec();

            return updatedUser ? UserMapper.toDomainFromSchema(updatedUser) : null;
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to update user with id: ${id} - ` + error
            );
        }
    }

    public async delete(id: string): Promise<void> {
        try {
            await this.collection.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new DatabaseException(
                `Error deleting user with id: ${id} - ` + error
            );
        }
    }
}