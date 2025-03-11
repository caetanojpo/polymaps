import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {RegionRepository} from "../../../src/infrastructure/database/repositories/region.repository";
import {RegionModel} from "../../../src/infrastructure/database/schemas/region.schema";
import {Region} from "../../../src/domain/models/region.model";
import {RegionMapper} from "../../../src/infrastructure/mapper/region.mapper";
import {DatabaseException} from "../../../src/domain/exceptions/database.exception";
import {PolygonModelImpl} from "../../../src/domain/models/polygon.model";
import {userResponseMock} from "../../mocks/user/user-response.mock";
import {User} from "../../../src/domain/models/user.model";
import {RegionException} from "../../../src/domain/exceptions/region.exception";

describe('RegionRepository', () => {
    let mongoServer: MongoMemoryServer;
    let repository: RegionRepository;

    beforeAll(async () => {
        jest.setTimeout(20000);
        mongoServer = await MongoMemoryServer.create();
        const uri = mongoServer.getUri();
        await mongoose.connect(uri, {dbName: 'test'});
        repository = RegionRepository.getInstance();
    });

    afterAll(async () => {
        await mongoose.disconnect();
        await mongoServer.stop();
    });

    afterEach(async () => {
        await RegionModel.deleteMany({});
    });

    it('should find a region by id', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const mockRegion = {_id: regionId, name: 'Test Region', owner: 'ownerId'};

        RegionModel.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValue(mockRegion)})
        });

        RegionMapper.toDomainFromSchema = jest.fn().mockReturnValue(
            new Region('Test Region',
                <PolygonModelImpl><unknown>{
                    type: "Polygon", coordinates: [
                        [
                            [-122.431297, 37.773972],
                            [-122.431300, 37.773975],
                            [-122.431305, 37.773980],
                            [-122.431297, 37.773972]
                        ]
                    ],
                }, <User>userResponseMock, regionId
            )
        );

        const result = await repository.findById(regionId);

        expect(result).toBeDefined();
        expect(result!._id).toBe(regionId);
    });

    it('should return null if region is not found', async () => {
        RegionModel.findById = jest.fn().mockReturnValue({
            populate: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValue(null)})
        });

        const result = await repository.findById('invalid_id');

        expect(result).toBeNull();
    });

    it('should throw DatabaseException if MongoDB fails', async () => {
        RegionModel.findById = jest.fn().mockReturnValue({
            exec: jest.fn().mockRejectedValue(new Error('MongoDB error'))
        });

        await expect(repository.findById('some_id')).rejects.toThrow(DatabaseException);
    });

    it('should find all regions', async () => {
        const mockRegions = [
            {name: 'Region1', owner: 'ownerId', _id: 'id1'},
            {name: 'Region2', owner: 'ownerId', _id: 'id2'}
        ];
        RegionModel.find = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(mockRegions)
        });

        RegionMapper.toDomainFromSchema = jest.fn().mockImplementation(region =>
            new Region(region.name, <PolygonModelImpl><unknown>{
                type: "Polygon", coordinates: [
                    [
                        [-122.431297, 37.773972],
                        [-122.431300, 37.773975],
                        [-122.431305, 37.773980],
                        [-122.431297, 37.773972]
                    ]
                ],
            }, <User>userResponseMock, region._id,)
        );

        const result = await repository.findAll();

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Region1');
    });

    it('should save a new region', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const newRegion = new Region(regionId,
            <PolygonModelImpl><unknown>{
                type: "Polygon", coordinates: [
                    [
                        [-122.431297, 37.773972],
                        [-122.431300, 37.773975],
                        [-122.431305, 37.773980],
                        [-122.431297, 37.773972]
                    ]
                ],
            }, <User>userResponseMock
        )
        newRegion.name = "New Region";
        const mockSchema = {...newRegion, save: jest.fn().mockResolvedValue(newRegion)};
        RegionMapper.toSchemaFromDomain = jest.fn().mockReturnValue(mockSchema);
        RegionModel.prototype.save = jest.fn().mockResolvedValue(mockSchema);

        const result = await repository.save(newRegion);

        expect(result.name).toBe('New Region');
    });

    it('should update an existing region', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const updatedRegion = new Region(regionId, <PolygonModelImpl><unknown>{
            type: "Polygon",
            coordinates: [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]
        }, <User>userResponseMock);

        RegionMapper.toSchemaFromDomain = jest.fn().mockReturnValue(updatedRegion);

        RegionModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(updatedRegion)
        });

        await repository.update(regionId, updatedRegion);
    });

    it('should throw RegionException if update fails', async () => {
        RegionModel.findByIdAndUpdate = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

        await expect(repository.update('invalid_id', new Region('invalid_id', <PolygonModelImpl><unknown>{
            type: "Polygon",
            coordinates: [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]
        }, <User>userResponseMock))).rejects.toThrow(RegionException);
    });

    it('should delete a region', async () => {
        RegionModel.findByIdAndDelete = jest.fn().mockReturnValue({
            exec: jest.fn().mockResolvedValue(null)
        });

        await expect(repository.delete('some_id')).resolves.toBeUndefined();
    });
});
