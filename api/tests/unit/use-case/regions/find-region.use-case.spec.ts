import {FindRegionUseCase} from "../../../../src/application/use-cases/region/find-region.use-case";
import {IRegionRepository} from "../../../../src/domain/repositories/iregion.repository";
import {EntityNotFoundException} from "../../../../src/domain/exceptions/entity-not-found.exception";
import {Coordinates} from "../../../../src/domain/types/coordinates.type";
import {regionMock} from "../../../mocks/region/region.mock";

describe("FindRegionUseCase", () => {
    let findRegionUseCase: FindRegionUseCase;
    let mockRegionRepository: jest.Mocked<IRegionRepository>;

    beforeEach(() => {
        mockRegionRepository = {
            findById: jest.fn(),
            findAll: jest.fn(),
            findRegionsContainingPoint: jest.fn(),
            findRegionsNearPoint: jest.fn()
        } as unknown as jest.Mocked<IRegionRepository>;

        findRegionUseCase = new FindRegionUseCase(mockRegionRepository);
    });

    it("should find a region by ID", async () => {
        const regionId = "valid-region-id";
        const region = {
            ...regionMock,
            id: regionId,
        };

        mockRegionRepository.findById.mockResolvedValue(region);

        const result = await findRegionUseCase.executeById(regionId);

        expect(result).toEqual(region);
        expect(mockRegionRepository.findById).toHaveBeenCalledWith(regionId);
    });

    it("should throw EntityNotFoundException when region ID is not found", async () => {
        const regionId = "invalid-region-id";
        mockRegionRepository.findById.mockResolvedValue(null);

        await expect(findRegionUseCase.executeById(regionId)).rejects.toThrow(EntityNotFoundException);
        expect(mockRegionRepository.findById).toHaveBeenCalledWith(regionId);
    });

    it("should find all regions when no ownerId is provided", async () => {
        const regions = [
            {
                ...regionMock,
                id: "region-1",
            }
        ];

        mockRegionRepository.findAll.mockResolvedValue(regions);

        const result = await findRegionUseCase.executeAll();

        expect(result).toEqual(regions);
        expect(mockRegionRepository.findAll).toHaveBeenCalledWith(undefined);
    });

    it("should find all regions for a specific owner", async () => {
        const ownerId = "valid-user-id";
        const regions = [{
            ...regionMock,
            id: "region-1",
        }];

        mockRegionRepository.findAll.mockResolvedValue(regions);

        const result = await findRegionUseCase.executeAll(ownerId);

        expect(result).toEqual(regions);
        expect(mockRegionRepository.findAll).toHaveBeenCalledWith(ownerId);
    });

    it("should find regions containing a specific point", async () => {
        const coordinates: Coordinates = {latitude: -122.431297, longitude: 37.773972};
        const regions = [{
            ...regionMock,
            id: "region-1",
            location: {type: "Polygon" as "Polygon", coordinates: []},
        }];

        mockRegionRepository.findRegionsContainingPoint.mockResolvedValue(regions);

        const result = await findRegionUseCase.executeRegionsContainingPoint(coordinates);

        expect(result).toEqual(regions);
        expect(mockRegionRepository.findRegionsContainingPoint).toHaveBeenCalledWith(coordinates);
    });

    it("should find regions near a specific point with max distance", async () => {
        const coordinates: Coordinates = {latitude: -122.431297, longitude: 37.773972};
        const regions = [{
            ...regionMock,
            id: "region-1",
            location: {type: "Polygon" as "Polygon", coordinates: []},
        }];
        const maxDistance = 1000;

        mockRegionRepository.findRegionsNearPoint.mockResolvedValue(regions);

        const result = await findRegionUseCase.executeRegionsNearPoint(coordinates, maxDistance);

        expect(result).toEqual(regions);
        expect(mockRegionRepository.findRegionsNearPoint).toHaveBeenCalledWith(coordinates, maxDistance, undefined);
    });

    it("should find regions near a specific point for a specific owner", async () => {
        const coordinates: Coordinates = {latitude: -122.431297, longitude: 37.773972};
        const regions = [{
            ...regionMock,
            id: "region-1",
            location: {type: "Polygon" as "Polygon", coordinates: []},
        }];
        const maxDistance = 1000;
        const ownerId = "valid-user-id";

        mockRegionRepository.findRegionsNearPoint.mockResolvedValue(regions);

        const result = await findRegionUseCase.executeRegionsNearPoint(coordinates, maxDistance, ownerId);

        expect(result).toEqual(regions);
        expect(mockRegionRepository.findRegionsNearPoint).toHaveBeenCalledWith(coordinates, maxDistance, ownerId);
    });
});
