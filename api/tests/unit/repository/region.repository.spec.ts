import {MongoMemoryServer} from 'mongodb-memory-server';
import mongoose from 'mongoose';
import {RegionRepository} from '../../../src/infrastructure/database/repositories/region.repository';
import {RegionModel, RegionSchema} from '../../../src/infrastructure/database/schemas/region.schema';
import {Region} from '../../../src/domain/models/region.model';
import {RegionMapper} from '../../../src/infrastructure/mapper/region.mapper';
import {DatabaseException} from '../../../src/domain/exceptions/database.exception';
import {PolygonModelImpl} from '../../../src/domain/models/polygon.model';
import {userResponseMock} from '../../mocks/user/user-response.mock';
import {User} from '../../../src/domain/models/user.model';
import {RegionException} from '../../../src/domain/exceptions/region.exception';

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
        jest.restoreAllMocks();
        await RegionModel.deleteMany({});
    });

    it('should find a region by id', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const mockRegion = {_id: regionId, name: 'Test Region', owner: 'ownerId'};

        jest.spyOn(RegionModel, 'findById').mockReturnValueOnce({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue(mockRegion)
            })
        } as any);

        jest.spyOn(RegionMapper, 'toDomainFromSchema').mockReturnValueOnce(
            new Region(
                'Test Region',
                new PolygonModelImpl('Polygon', [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]),
                userResponseMock as unknown as User,
                regionId
            )
        );

        const result = await repository.findById(regionId);

        expect(result).toBeDefined();
        expect(result?._id).toBe(regionId);
    });

    it('should return null if region is not found', async () => {
        jest.spyOn(RegionModel, 'findById').mockReturnValueOnce({
            populate: jest.fn().mockReturnValue({exec: jest.fn().mockResolvedValue(null)})
        } as any);

        const result = await repository.findById('invalid_id');

        expect(result).toBeNull();
    });

    it('should throw DatabaseException if MongoDB fails', async () => {
        jest.spyOn(RegionModel, 'findById').mockReturnValueOnce({
            exec: jest.fn().mockRejectedValue(new Error('MongoDB error'))
        } as any);

        await expect(repository.findById('some_id')).rejects.toThrow(DatabaseException);
    });

    it('should find all regions', async () => {
        const mockRegions = [
            {name: 'Region1', owner: 'ownerId', _id: 'id1'},
            {name: 'Region2', owner: 'ownerId', _id: 'id2'}
        ];

        jest.spyOn(RegionModel, 'find').mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(mockRegions)
        } as any);

        jest.spyOn(RegionMapper, 'toDomainFromSchema').mockImplementation(region =>
            new Region(region.name, new PolygonModelImpl('Polygon', [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]), userResponseMock as unknown as User, region._id)
        );

        const result = await repository.findAll();

        expect(result).toHaveLength(2);
        expect(result[0].name).toBe('Region1');
    });

    it('should save a new region', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const newRegion = new Region(
            regionId,
            new PolygonModelImpl('Polygon', [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]),
            userResponseMock as unknown as User
        );
        newRegion.name = 'New Region';

        const mockSchema: RegionSchema = {
            _id: regionId,
            name: newRegion.name,
            location: {
                type: newRegion.location.type,
                coordinates: newRegion.location.coordinates as number[][][]
            },
            owner: newRegion.owner,
            isActive: newRegion.isActive,
            createdAt: newRegion.createdAt,
            updatedAt: newRegion.updatedAt,
            save: jest.fn().mockResolvedValue(newRegion)
        } as unknown as RegionSchema;

        jest.spyOn(RegionMapper, 'toSchemaFromDomain').mockReturnValueOnce(mockSchema);
        jest.spyOn(RegionModel.prototype, 'save').mockResolvedValueOnce(mockSchema);

        const result = await repository.save(newRegion);

        expect(result.name).toBe('New Region');
    });

    it('should update an existing region', async () => {
        const regionId = new mongoose.Types.ObjectId().toHexString();
        const updatedRegion = new Region(
            regionId,
            new PolygonModelImpl('Polygon', [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]),
            userResponseMock as unknown as User
        );

        jest.spyOn(RegionMapper, 'toSchemaFromDomain').mockReturnValueOnce({
            _id: regionId,
            name: updatedRegion.name,
            location: {
                type: updatedRegion.location.type,
                coordinates: updatedRegion.location.coordinates
            },
            owner: updatedRegion.owner,
            isActive: updatedRegion.isActive,
            createdAt: updatedRegion.createdAt,
            updatedAt: updatedRegion.updatedAt
        } as unknown as RegionSchema);
        jest.spyOn(RegionModel, 'findByIdAndUpdate').mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(updatedRegion)
        } as any);

        await expect(repository.update(regionId, updatedRegion)).resolves.toBeUndefined();
    });

    it('should throw RegionException if update fails', async () => {
        jest.spyOn(RegionModel, 'findByIdAndUpdate').mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(null)
        } as any);

        await expect(repository.update('invalid_id', new Region('invalid_id', new PolygonModelImpl('Polygon', [[[-122.431297, 37.773972], [-122.431300, 37.773975], [-122.431305, 37.773980], [-122.431297, 37.773972]]]), userResponseMock as unknown as User))).rejects.toThrow(RegionException);
    });

    it('should delete a region', async () => {
        jest.spyOn(RegionModel, 'findByIdAndDelete').mockReturnValueOnce({
            exec: jest.fn().mockResolvedValue(null)
        } as any);

        await expect(repository.delete('some_id')).resolves.toBeUndefined();
    });

    it('should find regions containing a point', async () => {
        const coordinates = {latitude: -122.431297, longitude: 37.773972};

        jest.spyOn(RegionModel, 'find').mockReturnValueOnce({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([])
            })
        } as any);

        const result = await repository.findRegionsContainingPoint(coordinates);

        expect(result).toEqual([]);
    });

    it('should find regions near a point', async () => {
        const coordinates = {latitude: -122.431297, longitude: 37.773972};

        jest.spyOn(RegionModel, 'find').mockReturnValueOnce({
            populate: jest.fn().mockReturnValue({
                exec: jest.fn().mockResolvedValue([])
            })
        } as any);

        const result = await repository.findRegionsNearPoint(coordinates, 1000);

        expect(result).toEqual([]);
    });
});
