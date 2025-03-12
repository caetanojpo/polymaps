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
    public create: CreateRegionUseCase;
    public find: FindRegionUseCase;
    public update: UpdateRegionUseCase;
    public delete: DeleteRegionUseCase;

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

            const hasErrors = await this.validateErrors(regionData, req, res);
            if (hasErrors) return;

            logger.info("Creating new region", {regionData});
            const createdRegion = await this.create.execute(regionData);


            logger.info("Region created successfully", {regionId: createdRegion?._id});
            return res.status(STATUS_CODE.CREATED).json(ApiResponse.success(req.t('region.created'), {id: createdRegion?._id}));
        } catch (error) {
            logger.error("Error occurred while creating region", {error});
            next(error);
        }
    }

    public async findById(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            logger.info("Fetching region by ID", {regionId: id});
            const region = await this.find.executeById(id);

            const mappedRegion = RegionMapper.toRegionResponseFromDomain(region!);
            logger.info("Region found successfully", {regionId: id, mappedRegion});

            res.status(STATUS_CODE.OK).json(ApiResponse.success(req.t('region.found'), {mappedRegion}));
        } catch (error) {
            logger.error("Error occurred while fetching region by ID", {error});
            next(error);
        }
    }

    public async findAll(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const {ownerId} = req.query as { ownerId?: string };

            logger.info("Fetching all regions", {ownerId});
            const regions = await this.find.executeAll(ownerId);

            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));
            logger.info("Regions found", {regionsCount: mappedRegions.length});

            res.status(STATUS_CODE.OK).json(ApiResponse.success(req.t('regions.found'), {mappedRegions}));
        } catch (error) {
            logger.error("Error occurred while fetching regions", {error});
            next(error);
        }
    }

    public async listRegionsContainingPoint(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const regionData = plainToInstance(ListRegionsContainingPointDto, req.body as Object);
            const hasErrors = await this.validateErrors(regionData, req, res);
            if (hasErrors) return;

            const coordinates: Coordinates = {latitude: regionData.latitude, longitude: regionData.longitude};
            logger.info("Listing regions containing point", {coordinates});

            const regions = await this.find.executeRegionsContainingPoint(coordinates);
            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));

            logger.info("Regions containing point found", {regionsCount: regions.length, coordinates});


            return res.status(STATUS_CODE.OK).json(ApiResponse.success(req.t('regions.containing_point'), {
                regionsCount: regions.length,
                sharedPoint: regionData,
                regions: mappedRegions
            }));
        } catch (error) {
            logger.error("Error occurred while listing regions containing point", {error});
            next(error);
        }
    }

    public async listRegionsNearPoint(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const regionData = plainToInstance(ListRegionsNearPointDTO, req.body as Object);
            const {maxDistance = 5000, ownerId} = req.query as { maxDistance?: number, ownerId?: string };
            const hasErrors = await this.validateErrors(regionData, req, res);
            if (hasErrors) return;

            const coordinates: Coordinates = {latitude: regionData.latitude, longitude: regionData.longitude};
            logger.info("Listing regions near point", {coordinates, maxDistance, ownerId});

            const regions = await this.find.executeRegionsNearPoint(coordinates, maxDistance, ownerId);

            const mappedRegions = regions.map(region => RegionMapper.toRegionResponseFromDomain(region!));
            logger.info("Regions near point found", {regionsCount: regions.length, coordinates, maxDistance, ownerId});


            return res.status(STATUS_CODE.OK).json(ApiResponse.success(req.t('regions.near_point'), {
                regionsCount: regions.length,
                basePoint: regionData,
                distance: maxDistance,
                onlyOwnerRegions: !!ownerId,
                regions: mappedRegions
            }));
        } catch (error) {
            logger.error("Error occurred while listing regions near point", {error});
            next(error);
        }
    }

    public async updateRegion(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id
            const regionData = plainToInstance(UpdateRegionDto, req.body as Object);

            const hasErrors = await this.validateErrors(regionData, req, res);
            if (hasErrors) return;

            logger.info("Updating region", {regionId: id, regionData});
            await this.update.execute(id, regionData);

            logger.info("Region updated successfully", {regionId: id});
            return res.status(STATUS_CODE.NO_CONTENT).send();
            ;
        } catch (error) {
            logger.error("Error occurred while updating region", {error});
            next(error);
        }
    }

    public async deleteRegion(req: Request, res: Response, next: NextFunction): Promise<any> {
        try {
            const id = req.params.id;
            const {hardDelete = "false"} = req.query as { hardDelete?: string };
            const isHardDelete = hardDelete === "true";

            logger.info("Deleting region", {regionId: id, hardDelete: isHardDelete});

            if (isHardDelete) {
                await this.delete.executeHard(id);
                logger.info("Region hard deleted", {regionId: id});
            } else {
                await this.delete.execute(id);
                logger.info("Region soft deleted", {regionId: id});
            }

            return res.status(STATUS_CODE.NO_CONTENT).send();
        } catch (error) {
            logger.error("Error occurred while deleting region", {error});
            next(error);
        }
    }

    private async validateErrors(regionData: any, req:Request, res: Response): Promise<boolean> {
        const errors = await validate(regionData);
        if (errors.length > 0) {
            logger.warn("Validation failed for region data", errors.map(err => err.constraints));
            res.status(STATUS_CODE.BAD_REQUEST).json(
                ApiResponse.error(req.t('validation.failed'), "VALIDATION_ERROR", errors.map(err => err.constraints))
            );
            return true;
        }
        return false;
    }
}