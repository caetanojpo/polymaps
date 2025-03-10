import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {Region} from "../../../domain/models/region.model";
import {EntityNotFoundException} from "../../../domain/exceptions/entity-not-found.exception";
import {Coordinates} from "../../../domain/types/coordinates.type";

export class FindRegionUseCase {
    private readonly repository: IRegionRepository;

    constructor(repository: IRegionRepository) {
        this.repository = repository;
    }

    public async executeById(id: string): Promise<Region | null> {
        const region = await this.repository.findById(id);
        if (!region) {
            throw new EntityNotFoundException("Region", id);
        }
        return region;
    }

    public async executeAll(ownerId?: string): Promise<Region[]> {
        return await this.repository.findAll(ownerId);
    }

    public async executeRegionsContainingPoint(coordinates: Coordinates): Promise<Region[]> {
        return await this.repository.findRegionsContainingPoint(coordinates);
    }

    public async executeRegionsNearPoint(coordinates: Coordinates, maxDistance: number, ownerId?: string): Promise<Region[]> {
        return await this.repository.findRegionsNearPoint(coordinates, maxDistance, ownerId);
    }
}