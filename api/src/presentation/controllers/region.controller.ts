import {CreateRegionUseCase} from "../../application/use-cases/region/create-region.use-case";
import {RegionRepository} from "../../infrastructure/database/repositories/region.repository";
import {NextFunction, Request, Response} from "express";
import {plainToInstance} from "class-transformer";
import {CreateRegionDto} from "../../application/dtos/region/create-region.dto";
import {validate} from "class-validator";
import {logger} from "../../config/logger";
import STATUS_CODE from "../../utils/status-code";
import {ApiResponse} from "../../utils/api-response";
import {UserRepository} from "../../infrastructure/database/repositories/user.repository";

export class RegionController {
    private create: CreateRegionUseCase;

    constructor() {
        const regionRepository = RegionRepository.getInstance();
        const userRepository = UserRepository.getInstance();
        this.create = new CreateRegionUseCase(regionRepository, userRepository);
    }

    public async createRegion(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const regionData = plainToInstance(CreateRegionDto, req.body as Object);

            const hasErrors = await this.validateErrors(regionData, res);
            if (hasErrors) return;

            const createdRegion = await this.create.execute(regionData);

            return res.status(STATUS_CODE.CREATED).json(ApiResponse.success("Region created", {id: createdRegion?._id}));
        } catch (error) {
            next(error);
        }
    }

    private async validateErrors(userData: any, res: Response): Promise<boolean> {
        const errors = await validate(userData);
        if (errors.length > 0) {
            logger.warn("Validation failed for region data", errors.map(err => err.constraints));
            res.status(STATUS_CODE.BAD_REQUEST).json(
                ApiResponse.error("Validation failed", "VALIDATION_ERROR", errors.map(err => err.constraints))
            );
            return true;
        }
        return false;
    }
}