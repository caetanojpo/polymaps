import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {IUserRepository} from "../../../domain/repositories/iuser.repository";
import {RegionMapper} from "../../../infrastructure/mapper/region.mapper";
import {UpdateRegionDto} from "../../dtos/region/update-region.dto";
import {RegionException} from "../../../domain/exceptions/region.exception";

export class UpdateRegionUseCase {
    private readonly repository: IRegionRepository;
    private readonly userRepository: IUserRepository;

    constructor(repository: IRegionRepository, userRepository: IUserRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public async execute(id: string, updateRegionDto: UpdateRegionDto): Promise<void> {
        const region = RegionMapper.toDomainFromUpdateUserDTO(updateRegionDto);
        if (updateRegionDto.ownerId) {
            const user = await this.userRepository.findById(updateRegionDto.ownerId);
            if (!user) {
                throw new RegionException("New owner not found");
            }
            region.owner = user;
        }
        if (updateRegionDto.coordinates) {
            region.location = {
                type: 'Polygon',
                coordinates: updateRegionDto.coordinates
            }
        }
        region.updatedAt = new Date();
        return await this.repository.update(id, region);
    }
}