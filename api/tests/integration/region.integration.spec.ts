import request from 'supertest';
import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import App from "../../src/app";
import {CreateRegionDto} from "../../src/application/dtos/region/create-region.dto";
import {NextFunction, Response, Request} from "express";
import {RegionModel} from "../../src/infrastructure/database/schemas/region.schema";

jest.mock('../../src/infrastructure/middlewares/auth.middleware', () => ({
    authMiddleware: (req: Request, res: Response, next: NextFunction) => next(),
}));

let mongoServer: MongoMemoryServer;
let createdUserId: string;

beforeAll(async () => {
    jest.setTimeout(30000);
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();
    await mongoose.connect(uri, {dbName: 'test'});
});

beforeEach(async () => {
    await mongoose.connection.db.dropDatabase();

    const userResponse = await request(App)
        .post('/api/v1/users')
        .send({
            name: 'Region Owner',
            email: `testuser+${Date.now()}@example.com`,
            password: 'Password123!',
            address: '123 Test St'
        });

    if (userResponse.status !== 201) {
        throw new Error(`Test user creation failed: ${JSON.stringify(userResponse.body)}`);
    }
    createdUserId = userResponse.body.data.id;
});

afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
});

const getValidRegionData = (): CreateRegionDto => ({
    name: 'Test Region',
    owner: createdUserId,
    coordinates: [
        [
            [0, 0],
            [3, 0],
            [3, 3],
            [0, 3],
            [0, 0]
        ]
    ]
});

describe('Region API Integration Tests', () => {
    describe('POST /regions', () => {
        it('should create a new region', async () => {
            const response = await request(App)
                .post('/api/v1/regions')
                .send(getValidRegionData())
                .expect(201);

            expect(response.body).toHaveProperty('status', 'success');
            expect(response.body).toHaveProperty('message');
            expect(response.body).toHaveProperty('data');
            expect(response.body.data).toHaveProperty('id');
        });
    });

    describe('GET /regions', () => {
        it('should retrieve all regions', async () => {
            await request(App).post('/api/v1/regions').send(getValidRegionData());
            await request(App).post('/api/v1/regions').send({
                ...getValidRegionData(),
                name: 'Second Region'
            });

            const response = await request(App)
                .get('/api/v1/regions')
                .expect(200);

            expect(response.body.data.mappedRegions).toHaveLength(2);
        });

        it('should filter regions by ownerId', async () => {
            const newUser = await request(App)
                .post('/api/v1/users')
                .send({
                    name: 'Another Owner',
                    email: 'another@owner.com',
                    password: 'Password123!',
                    address: '456 Test St'
                });

            await request(App).post('/api/v1/regions').send(getValidRegionData());
            await request(App).post('/api/v1/regions').send({
                ...getValidRegionData(),
                owner: newUser.body.data.id
            });

            const response = await request(App)
                .get(`/api/v1/regions?ownerId=${createdUserId}`)
                .expect(200);

            expect(response.body.data.mappedRegions).toHaveLength(1);
        });
    });

    describe('POST /regions/containing-point', () => {
        it('should find regions containing a point', async () => {
            const regionResponse = await request(App)
                .post('/api/v1/regions')
                .send({
                    ...getValidRegionData(),
                    coordinates: [
                        [
                            [0, 0],
                            [5, 0],
                            [5, 5],
                            [0, 5],
                            [0, 0]
                        ]
                    ]
                })
                .expect(201);

            const regions = await request(App).get('/api/v1/regions');
            expect(regions.body.data.mappedRegions).toHaveLength(1);

            const response = await request(App)
                .post('/api/v1/regions/containing-point')
                .send({latitude: 5, longitude: 0})
                .expect(200);

            expect(response.body.data.regionsCount).toBe(1);

            expect(response.body.data.regions).toHaveLength(1);
            expect(response.body.data.regions[0]).toHaveProperty('name');
            expect(response.body.data.regions[0]).toHaveProperty('location');
        });
    });

    describe('POST /regions/near', () => {
        it('should find regions near a point', async () => {
            const regionResponse = await request(App)
                .post('/api/v1/regions')
                .send({
                    ...getValidRegionData(),
                    coordinates: [
                        [
                            [0, 0],
                            [5, 0],
                            [5, 5],
                            [0, 5],
                            [0, 0]
                        ]
                    ]
                })
                .expect(201);

            await RegionModel.ensureIndexes();

            const regions = await request(App).get('/api/v1/regions');
            expect(regions.body.data.mappedRegions).toHaveLength(1);

            const response = await request(App)
                .post('/api/v1/regions/near')
                .send({ latitude: 5, longitude: 0 })
                .expect(200);

            expect(response.body.data.distance).toBe(5000);
            expect(response.body.data.regions).toHaveLength(1);
            expect(response.body.data.regions[0]).toHaveProperty('name');
            expect(response.body.data.regions[0]).toHaveProperty('location');
        });
    });
});