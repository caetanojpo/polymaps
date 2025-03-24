import {UpdateRegionUseCase} from "../../../../src/application/use-cases/region/update-region.use-case";
import {IRegionRepository} from "../../../../src/domain/repositories/iregion.repository";
import {IUserRepository} from "../../../../src/domain/repositories/iuser.repository";
import {UpdateRegionDto} from "../../../../src/application/dtos/region/update-region.dto";
import {RegionException} from "../../../../src/domain/exceptions/region.exception";
import {Region} from "../../../../src/domain/models/region.model";
import {RegionMapper} from "../../../../src/infrastructure/mapper/region.mapper";
import {regionMock, updateRegionDTOMock} from "../../../mocks/region/region.mock";
import {userMock} from "../../../mocks/user/userMock";

jest.mock("../../../../src/infrastructure/mapper/region.mapper");

describe("UpdateRegionUseCase", () => {
    let updateRegionUseCase: UpdateRegionUseCase;
    let mockRegionRepository: jest.Mocked<IRegionRepository>;
    let mockUserRepository: jest.Mocked<IUserRepository>;

    beforeEach(() => {
        mockRegionRepository = {
            update: jest.fn(),
        } as unknown as jest.Mocked<IRegionRepository>;

        mockUserRepository = {
            findById: jest.fn(),
        } as unknown as jest.Mocked<IUserRepository>;

        updateRegionUseCase = new UpdateRegionUseCase(mockRegionRepository, mockUserRepository);
    });

    it("should update a region successfully", async () => {
        const regionId = "valid-region-id";
        const updateDto: UpdateRegionDto = updateRegionDTOMock;

        const mappedRegion: Region = {
            ...regionMock,
            name: updateRegionDTOMock.name!,
            location: {
                type: "Polygon",
                coordinates: updateRegionDTOMock.coordinates!
            }
        };

        (RegionMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(mappedRegion);
        mockUserRepository.findById.mockResolvedValue(userMock);
        mockRegionRepository.update.mockResolvedValue();

        await updateRegionUseCase.execute(regionId, updateDto);

        expect(mockUserRepository.findById).toHaveBeenCalledWith(updateDto.ownerId);
        expect(mockRegionRepository.update).toHaveBeenCalledWith(regionId, expect.objectContaining(mappedRegion));
    });

    it("should throw an error if new owner is not found", async () => {
        const regionId = "valid-region-id";
        const updateDto: UpdateRegionDto = updateRegionDTOMock;

        const mappedRegion: Region = {
            ...regionMock,
            name: updateRegionDTOMock.name!,
            location: {
                type: "Polygon",
                coordinates: updateRegionDTOMock.coordinates!
            }
        };

        (RegionMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(mappedRegion);
        mockUserRepository.findById.mockResolvedValue(null);

        await expect(updateRegionUseCase.execute(regionId, updateDto)).rejects.toThrow(RegionException);
        expect(mockUserRepository.findById).toHaveBeenCalledWith(updateDto.ownerId);
        expect(mockRegionRepository.update).not.toHaveBeenCalled();
    });

    it("should update region location when coordinates are provided", async () => {
        const regionId = "valid-region-id";
        const updateDto: UpdateRegionDto = {
            coordinates: [
                [
                    [-122.431297, 37.773972],
                    [-122.431300, 37.773975],
                    [-122.431305, 37.773980],
                    [-122.431297, 37.773972]
                ]
            ]
        };

        (RegionMapper.toDomainFromUpdateUserDTO as jest.Mock).mockReturnValue(regionMock);
        mockRegionRepository.update.mockResolvedValue();

        await updateRegionUseCase.execute(regionId, updateDto);

        expect(mockRegionRepository.update).toHaveBeenCalledWith(regionId, expect.objectContaining({
            location: {
                type: "Polygon",
                coordinates: updateDto.coordinates
            }
        }));
    });
});
