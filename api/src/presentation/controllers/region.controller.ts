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
import {Coordinates} from "../../domain/types/coordinates.type";
import {ListRegionsContainingPointDto} from "../../application/dtos/region/list-regions-containing-point.dto";
import {FindRegionUseCase} from "../../application/use-cases/region/find-region.use-case";
import {DeleteRegionUseCase} from "../../application/use-cases/region/delete-region.use-case";
import {UpdateRegionUseCase} from "../../application/use-cases/region/update-region.use-case";
import {ListRegionsNearPointDTO} from "../../application/dtos/region/list-regions-near-point.dto";
import {RegionMapper} from "../../infrastructure/mapper/region.mapper";
import {UpdateRegionDto} from "../../application/dtos/region/update-region.dto";

export class RegionController {
    private create: CreateRegionUseCase;
    private find: FindRegionUseCase;
    private update: UpdateRegionUseCase;
    private delete: DeleteRegionUseCase;

    constructor() {
        const regionRepository = RegionRepository.getInstance();
        const userRepository = UserRepository.getInstance();
        this.create = new CreateRegionUseCase(regionRepository, userRepository);
        this.find = new FindRegionUseCase(regionRepository);
        this.update = new UpdateRegionUseCase(regionRepository, userRepository);
        this.delete = new DeleteRegionUseCase(regionRepository);
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

    public async findById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const region = await this.find.executeById(id);

            const mappedRegion = RegionMapper.toRegionResponseFromDomain(region!);

            res.status(STATUS_CODE.OK).json(ApiResponse.success("Region found", {mappedRegion}));
        } catch (error) {
            next(error);
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const {ownerId} = req.query as { ownerId?: string };

            const regions = await this.find.executeAll(ownerId);
            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));

            res.status(STATUS_CODE.OK).json(ApiResponse.success("Regions found", {mappedRegions}));
        } catch (error) {
            next(error);
        }
    }

    public async listRegionsContainingPoint(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const regionData = plainToInstance(ListRegionsContainingPointDto, req.body as Object);
            const hasErrors = await this.validateErrors(regionData, res);
            if (hasErrors) return;
            const coordinates: Coordinates = {latitude: regionData.latitude, longitude: regionData.longitude};
            const regions = await this.find.executeRegionsContainingPoint(coordinates);
            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));

            return res.status(STATUS_CODE.OK).json(ApiResponse.success("Regions containing the point", mappedRegions));
        } catch (error) {
            next(error);
        }
    }

    public async listRegionsNearPoint(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const regionData = plainToInstance(ListRegionsNearPointDTO, req.body as object);
            const {maxDistance = 5000, ownerId} = req.query as { maxDistance?: number, ownerId?: string };

            const hasErrors = await this.validateErrors(regionData, res);
            if (hasErrors) return;

            const coordinates: Coordinates = {latitude: regionData.latitude, longitude: regionData.longitude};
            const regions = await this.find.executeRegionsNearPoint(coordinates, maxDistance, ownerId);

            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));

            return res.status(STATUS_CODE.OK).json(ApiResponse.success("Regions near the point", mappedRegions));
        } catch (error) {
            next(error);
        }
    }

    public async updateRegion(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id
            const regionData = plainToInstance(UpdateRegionDto, req.body as Object);

            const hasErrors = await this.validateErrors(regionData, res);
            if (hasErrors) return;

            const updatedRegion = await this.update.execute(id, regionData);

            return res.status(STATUS_CODE.NO_CONTENT);
        } catch (error) {
            next(error);
        }
    }

    public async deleteRegion(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const {hardDelete = false} = req.query as { hardDelete?: boolean };
            if (hardDelete) {
                await this.delete.executeHard(id);
            } else {
                await this.delete.execute(id);
            }

            return res.status(STATUS_CODE.NO_CONTENT);
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