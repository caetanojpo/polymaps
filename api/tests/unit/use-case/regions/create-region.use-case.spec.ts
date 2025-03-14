import {CreateRegionUseCase} from "../../../../src/application/use-cases/region/create-region.use-case";
import {IRegionRepository} from "../../../../src/domain/repositories/iregion.repository";
import {IUserRepository} from "../../../../src/domain/repositories/iuser.repository";
import {CreateRegionDto} from "../../../../src/application/dtos/region/create-region.dto";
import {Region} from "../../../../src/domain/models/region.model";
import {RegionException} from "../../../../src/domain/exceptions/region.exception";
import {userMock} from "../../../mocks/user/userMock";
import {createRegionDTOMock} from "../../../mocks/region/region.mock";

jest.mock("../../../../src/domain/repositories/iregion.repository");
jest.mock("../../../../src/domain/repositories/iuser.repository");

describe("CreateRegionUseCase", () => {
    let regionRepository: jest.Mocked<IRegionRepository>;
    let userRepository: jest.Mocked<IUserRepository>;
    let createRegionUseCase: CreateRegionUseCase;

    beforeEach(() => {
        regionRepository = {
            save: jest.fn()
        } as unknown as jest.Mocked<IRegionRepository>;

        userRepository = {
            findById: jest.fn()
        } as unknown as jest.Mocked<IUserRepository>;

        createRegionUseCase = new CreateRegionUseCase(regionRepository, userRepository);
    });

    it("should create a region when owner exists", async () => {
        userRepository.findById.mockResolvedValue(userMock);
        const savedRegion = {
            ...createRegionDTOMock, owner: userMock, location: {
                type: "Polygon",
                coordinates: [
                    [
                        [-122.431297, 37.773972],
                        [-122.431300, 37.773975],
                        [-122.431305, 37.773980],
                        [-122.431297, 37.773972]
                    ]
                ]
            },
            isActive: true
        } as Region;
        regionRepository.save.mockResolvedValue(savedRegion);

        const result = await createRegionUseCase.execute(createRegionDTOMock);

        expect(userRepository.findById).toHaveBeenCalledWith("valid-user-id");
        expect(regionRepository.save).toHaveBeenCalledWith(expect.objectContaining({
            name: "Test Region",
            owner: userMock,
            location: {type: 'Polygon', coordinates: createRegionDTOMock.coordinates},
            isActive: true
        }));
        expect(result).toEqual(savedRegion);
    });

    it("should throw an exception when owner does not exist", async () => {
        const createRegionDto: CreateRegionDto = {
            name: "Invalid Region",
            owner: "invalid-user-id",
            coordinates: [[[0, 0], [1, 1], [1, 0], [0, 0]]]
        };

        userRepository.findById.mockResolvedValue(null);

        await expect(createRegionUseCase.execute(createRegionDto))
            .rejects.toThrow(new RegionException("Owner not found"));

        expect(userRepository.findById).toHaveBeenCalledWith("invalid-user-id");
        expect(regionRepository.save).not.toHaveBeenCalled();
    });
});
