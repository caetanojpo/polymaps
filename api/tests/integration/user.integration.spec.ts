import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import App from "../../src/app";
import {NextFunction, Response, Request} from "express";


jest.mock('../../src/infrastructure/middlewares/auth.middleware', () => ({
    authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
}));

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
    jest.setTimeout(20000);
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {dbName: 'test'});
})

afterAll(async () => {

    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
    await mongoServer.stop();
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();
});

describe('POST /users', () => {
    it('should create a new user', async () => {
        const newUser = {
            email: 'testuser@example.com',
            name: 'Test User',
            password: 'Password123!',
            address: '123 Test St',
        };

        const response = await request(App)
            .post('/api/v1/users')
            .send(newUser)
            .expect('Content-Type', /json/)
            .expect(201);

        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('data');
        expect(response.body.data).toHaveProperty('id');
    });

    it('should return 400 if required fields are missing', async () => {
        const incompleteUser = {
            email: 'testuser@example.com',
            password: 'password123',
        };

        const response = await request(App)
            .post('/api/v1/users')
            .send(incompleteUser)
            .expect('Content-Type', /json/)
            .expect(400);

        expect(response.body).toHaveProperty('status', 'error');
        expect(response.body).toHaveProperty('message');
        expect(response.body).toHaveProperty('errorCode');
    });
});

describe('GET /users', () => {
    it('should retrieve all users', async () => {
        const newUser = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'Password123!',
            address: '123 Test St',
        };
        await request(App).post('/api/v1/users').send(newUser);

        const response = await request(App)
            .get('/api/v1/users')
            .expect(200);

        expect(response.body).toHaveProperty('status', 'success');
        expect(response.body.data.mappedUsers).toHaveLength(1);
    });

    it('should return empty array when no users exist', async () => {
        const response = await request(App)
            .get('/api/v1/users')
            .expect(200);

        expect(response.body.data.mappedUsers).toHaveLength(0);
    });
});

describe('GET /users/:id', () => {
    it('should retrieve user by ID', async () => {
        const newUser = {
            email: 'test@example.com',
            name: 'Test User',
            password: 'Password123!',
            address: '123 Test St',
        };
        const postResponse = await request(App)
            .post('/api/v1/users')
            .send(newUser);

        const response = await request(App)
            .get(`/api/v1/users/${postResponse.body.data.id}`)
            .expect(200);

        expect(response.body.data.mappedUser.email).toBe(newUser.email);
    });

    it('should return 404 for non-existent user ID', async () => {
        const fakeId = new mongoose.Types.ObjectId().toHexString();
        const response = await request(App)
            .get(`/api/v1/users/${fakeId}`)
            .expect(404);

        expect(response.body).toHaveProperty('status', 'error');
    });
});

describe('GET /users/email/:email', () => {
    it('should retrieve user by email', async () => {
        const testEmail = 'test@example.com';
        await request(App)
            .post('/api/v1/users')
            .send({
                email: testEmail,
                name: 'Test User',
                password: 'Password123!',
                address: '123 Test St',
            });

        const response = await request(App)
            .get(`/api/v1/users/email/${testEmail}`)
            .expect(200);

        expect(response.body.data.mappedUser.email).toBe(testEmail);
    });

    it('should return 404 for non-existent email', async () => {
        const response = await request(App)
            .get('/api/v1/users/email/nonexistent@example.com')
            .expect(404);

        expect(response.body).toHaveProperty('status', 'error');
    });
});

describe('PUT /users/:id', () => {
    it('should update user successfully', async () => {
        const postResponse = await request(App)
            .post('/api/v1/users')
            .send({
                email: 'test@example.com',
                name: 'Original Name',
                password: 'Password123!',
                address: '123 Test St',
            });

        const updatedData = { name: 'Updated Name' };
        await request(App)
            .put(`/api/v1/users/${postResponse.body.data.id}`)
            .send(updatedData)
            .expect(204);

        const getResponse = await request(App)
            .get(`/api/v1/users/${postResponse.body.data.id}`)
            .expect(200);

        expect(getResponse.body.data.mappedUser.name).toBe(updatedData.name);
    });

    it('should return 400 for invalid update data', async () => {
        const postResponse = await request(App)
            .post('/api/v1/users')
            .send({
                email: 'test@example.com',
                name: 'Test User',
                password: 'Password123!',
                address: '123 Test St',
            });

        const response = await request(App)
            .put(`/api/v1/users/${postResponse.body.data.id}`)
            .send({ email: 'invalid-email' })
            .expect(400);

        expect(response.body).toHaveProperty('status', 'error');
    });
});

describe('DELETE /users/:id', () => {
    it('should soft delete user', async () => {
        const postResponse = await request(App)
            .post('/api/v1/users')
            .send({
                email: 'test@example.com',
                name: 'Test User',
                password: 'Password123!',
                address: '123 Test St',
            });

        await request(App)
            .delete(`/api/v1/users/${postResponse.body.data.id}`)
            .expect(204);

        const getResponse = await request(App)
            .get(`/api/v1/users/${postResponse.body.data.id}`)
            .expect(200);
    });

    it('should hard delete user', async () => {
        const postResponse = await request(App)
            .post('/api/v1/users')
            .send({
                email: 'test@example.com',
                name: 'Test User',
                password: 'Password123!',
                address: '123 Test St',
            });

        await request(App)
            .delete(`/api/v1/users/${postResponse.body.data.id}?hardDelete=true`)
            .expect(204);

        const getResponse = await request(App)
            .get(`/api/v1/users/${postResponse.body.data.id}`)
            .expect(404);
    });

    it('should return 404 when deleting non-existent user', async () => {
        const fakeId = new mongoose.Types.ObjectId().toHexString();
        await request(App)
            .delete(`/api/v1/users/${fakeId}`)
            .expect(404);
    });
});
