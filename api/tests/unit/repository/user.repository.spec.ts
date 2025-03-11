import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {UserRepository} from "../../../src/infrastructure/database/repositories/user.repository";
import {UserModel} from "../../../src/infrastructure/database/schemas/user.schema";
import {User} from "../../../src/domain/models/user.model";


describe('UserRepository', () => {
    let mongoServer: MongoMemoryServer;
    let userRepository: UserRepository;

    beforeAll(async () => {
        jest.setTimeout(20000);
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, { dbName: 'test' });
        userRepository = UserRepository.getInstance();
    })

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await UserModel.deleteMany({});
    });

    test('should save a user', async () => {
        const user = new User('John Doe', 'john@example.com', 'hashedPassword', new mongoose.Types.ObjectId().toHexString());
        const savedUser = await userRepository.save(user);
        expect(savedUser).toHaveProperty('_id');
        expect(savedUser.name).toBe(user.name);
        expect(savedUser.email).toBe(user.email);
    });

    test('should find a user by id', async () => {
        const user = new User('Jane Doe', 'jane@example.com', 'hashedPassword', new mongoose.Types.ObjectId().toHexString());
        const savedUser = await userRepository.save(user);
        let foundUser;
        if (savedUser._id != null) {
            foundUser = await userRepository.findById(savedUser._id);
        }
        expect(foundUser).toBeDefined();
        expect(foundUser?.email).toBe(user.email);
    });

    test('should return null if user not found by id', async () => {
        const foundUser = await userRepository.findById(new mongoose.Types.ObjectId().toString());
        expect(foundUser).toBeNull();
    });

    test('should find a user by email', async () => {
        const user = new User('Alice Doe', 'alice@example.com', 'hashedPassword', new mongoose.Types.ObjectId().toHexString());
        await userRepository.save(user);
        const foundUser = await userRepository.findByEmail('alice@example.com');
        expect(foundUser).toBeDefined();
        expect(foundUser?.email).toBe('alice@example.com');
    });

    test('should return null if user not found by email', async () => {
        const foundUser = await userRepository.findByEmail('notfound@example.com');
        expect(foundUser).toBeNull();
    });

    test('should find all users', async () => {
        await userRepository.save(new User('User One', 'one@example.com', 'pass', new mongoose.Types.ObjectId().toHexString()));
        await userRepository.save(new User('User Two', 'two@example.com', 'pass', new mongoose.Types.ObjectId().toHexString()));
        const users = await userRepository.findAll();
        expect(users.length).toBe(2);
    });

    test('should update a user', async () => {
        const user = new User('Bob Doe', 'bob@example.com', 'hashedPassword', new mongoose.Types.ObjectId().toHexString());
        const savedUser = await userRepository.save(user);
        const updatedData = new User('Bob Updated', 'bob@example.com', 'newPassword', <string>savedUser._id);
        const updatedUser = await userRepository.update(<string>savedUser._id, updatedData);
        expect(updatedUser).toBeDefined();
        expect(updatedUser?.name).toBe('Bob Updated');
    });

    test('should delete a user', async () => {
        const user = new User('Eve Doe', 'eve@example.com', 'hashedPassword', new mongoose.Types.ObjectId().toHexString());
        const savedUser = await userRepository.save(user);
        await userRepository.delete(<string>savedUser._id);
        const foundUser = await userRepository.findById(<string>savedUser._id);
        expect(foundUser).toBeNull();
    });
});