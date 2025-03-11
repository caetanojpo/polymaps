import {DeleteRegionUseCase} from "../../../../src/application/use-cases/region/delete-region.use-case";
import {IRegionRepository} from "../../../../src/domain/repositories/iregion.repository";
import {EntityNotFoundException} from "../../../../src/domain/exceptions/entity-not-found.exception";
import {GeoJSON} from "../../../../src/domain/models/geo-json.model";
import LinearRing = GeoJSON.LinearRing;


describe("DeleteRegionUseCase", () => {
    let deleteRegionUseCase: DeleteRegionUseCase;
    let mockRegionRepository: jest.Mocked<IRegionRepository>;

    beforeEach(() => {
        mockRegionRepository = {
            findById: jest.fn(),
            update: jest.fn(),
            delete: jest.fn()
        } as unknown as jest.Mocked<IRegionRepository>;

        deleteRegionUseCase = new DeleteRegionUseCase(mockRegionRepository);
    });

    it("should deactivate a region when it exists", async () => {
        const regionId = "valid-region-id";
        const user = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "password123",
            address: "ABC 123"
        };
        const region = {
            name: "Test Region", location: {
                type: "Polygon" as "Polygon",
                coordinates: [
                    [
                        [-122.431297, 37.773972],
                        [-122.431300, 37.773975],
                        [-122.431305, 37.773980],
                        [-122.431297, 37.773972]
                    ]
                ] as LinearRing[]
            }, owner: user, isActive: true, updatedAt: new Date(), id: regionId
        };

        mockRegionRepository.findById.mockResolvedValue(region);
        mockRegionRepository.update.mockResolvedValue();

        await deleteRegionUseCase.execute(regionId);

        expect(mockRegionRepository.findById).toHaveBeenCalledWith(regionId);
        expect(mockRegionRepository.update).toHaveBeenCalledWith(regionId, expect.objectContaining({isActive: false}));
    });

    it("should throw EntityNotFoundException if the region does not exist (soft delete)", async () => {
        const regionId = "invalid-region-id";
        mockRegionRepository.findById.mockResolvedValue(null);

        await expect(deleteRegionUseCase.execute(regionId)).rejects.toThrow(EntityNotFoundException);
        expect(mockRegionRepository.update).not.toHaveBeenCalled();
    });

    it("should permanently delete a region when it exists", async () => {
        const regionId = "valid-region-id";
        const user = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "password123",
            address: "ABC 123"
        };
        const region = {
            name: "Test Region", location: {
                type: "Polygon" as "Polygon",
                coordinates: [
                    [
                        [-122.431297, 37.773972],
                        [-122.431300, 37.773975],
                        [-122.431305, 37.773980],
                        [-122.431297, 37.773972]
                    ]
                ] as LinearRing[]
            }, owner: user, isActive: true, updatedAt: new Date(), id: regionId
        };

        mockRegionRepository.findById.mockResolvedValue(region);
        mockRegionRepository.delete.mockResolvedValue();

        await deleteRegionUseCase.executeHard(regionId);

        expect(mockRegionRepository.findById).toHaveBeenCalledWith(regionId);
        expect(mockRegionRepository.delete).toHaveBeenCalledWith(regionId);
    });

    it("should throw EntityNotFoundException if the region does not exist (hard delete)", async () => {
        const regionId = "invalid-region-id";
        mockRegionRepository.findById.mockResolvedValue(null);

        await expect(deleteRegionUseCase.executeHard(regionId)).rejects.toThrow(EntityNotFoundException);
        expect(mockRegionRepository.delete).not.toHaveBeenCalled();
    });
});
