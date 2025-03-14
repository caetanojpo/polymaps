import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {Region} from "../../../domain/models/region.model";
import {RegionMapper} from "../../../infrastructure/mapper/region.mapper";
import {CreateRegionDto} from "../../dtos/region/create-region.dto";
import {IUserRepository} from "../../../domain/repositories/iuser.repository";
import {RegionException} from "../../../domain/exceptions/region.exception";
import {GeoJSON} from "../../../domain/models/geo-json.model";
import LinearRing = GeoJSON.LinearRing;

export class CreateRegionUseCase {
    private readonly repository: IRegionRepository;
    private readonly userRepository: IUserRepository;

    constructor(repository: IRegionRepository, userRepository: IUserRepository) {
        this.repository = repository;
        this.userRepository = userRepository;
    }

    public async execute(createRegionDTO: CreateRegionDto): Promise<Region | null> {
        const region = RegionMapper.toDomainFromCreateRegionDTO(createRegionDTO);
        const user = await this.userRepository.findById(createRegionDTO.owner);
        if (!user) {
            throw new RegionException("Owner not found");
        }
        region.owner = user;
        region.location = {
            type: 'Polygon',
            coordinates: createRegionDTO.coordinates as LinearRing[]
        };
        region.isActive = true;
        return await this.repository.save(region);
    }
}