import {DeleteRegionUseCase} from "../../../../src/application/use-cases/region/delete-region.use-case";
import {IRegionRepository} from "../../../../src/domain/repositories/iregion.repository";
import {EntityNotFoundException} from "../../../../src/domain/exceptions/entity-not-found.exception";
import {regionMock} from "../../../mocks/region/region.mock";


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
        const region = {...regionMock, id: regionId}
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
        const region = {
            ...regionMock, id: regionId
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
