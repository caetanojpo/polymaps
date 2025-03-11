import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {EntityNotFoundException} from "../../../domain/exceptions/entity-not-found.exception";
import {logger} from "../../../config/logger";

export class DeleteRegionUseCase {
    private readonly repository: IRegionRepository;

    constructor(repository: IRegionRepository) {
        this.repository = repository;
    }

    public async execute(id: string): Promise<void> {
        logger.info("DeleteRegionUseCase.execute", id);
        const region = await this.repository.findById(id);

        if (!region) {
            throw new EntityNotFoundException("Region", id);
        }
        region.isActive = false;
        region.updatedAt = new Date();

        await this.repository.update(id, region);
    }

    public async executeHard(id: string): Promise<void> {
        logger.info("DeleteRegionUseCase.executeHard", id);
        const region = await this.repository.findById(id);
        if (!region) {
            throw new EntityNotFoundException("Region", id);
        }
        return await this.repository.delete(id);
    }
}