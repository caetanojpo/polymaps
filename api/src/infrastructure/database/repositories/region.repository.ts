import {Region} from "../../../domain/models/region.model";
import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {Coordinates} from "../../../domain/types/coordinates.type";
import {RegionModel} from "../schemas/region.schema";
import {DatabaseException} from "../../../domain/exceptions/database.exception";
import {RegionMapper} from "../../mapper/region.mapper";
import {RegionException} from "../../../domain/exceptions/region.exception";

export class RegionRepository implements IRegionRepository {
    private static instance: RegionRepository;
    private readonly collection: typeof RegionModel;

    constructor() {
        this.collection = RegionModel;
    }

    public static getInstance(): RegionRepository {
        if (!RegionRepository.instance) {
            RegionRepository.instance = new RegionRepository();
        }
        return RegionRepository.instance;
    }

    public async findById(id: string): Promise<Region | null> {
        try {
            const regionDocument = await this.collection.findById(id).populate('owner').exec();
            return regionDocument ? RegionMapper.toDomainFromSchema(regionDocument) : null
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to find region by id ${id} - ` + error
            );
        }
    }

    public async findAll(ownerId?: string): Promise<Region[]> {
        try {
            const query = ownerId ? {owner: ownerId} : {};
            const regions = await this.collection.find(query).exec();

            return regions.map((region) => RegionMapper.toDomainFromSchema(region));
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list all regions with filter from owner: ${ownerId} - ` + error
            );
        }
    }

    public async findRegionsContainingPoint(coordinates: Coordinates): Promise<Region[]> {
        try {
            const point = {
                type: "Point",
                coordinates: [coordinates.latitude, coordinates.longitude],
            };

            const regions = await this.collection.find({
                "location": {
                    $geoIntersects: {$geometry: point}
                }
            }).exec();
            return regions.map((region) => RegionMapper.toDomainFromSchema(region));
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list regions containing the point: ${JSON.stringify(coordinates)} - ` + error
            );
        }
    }

    public async findRegionsNearPoint(coordinates: Coordinates, maxDistance: number, ownerId?: string): Promise<Region[]> {
        try {
            const point = {
                type: "Point",
                coordinates: [coordinates.latitude, coordinates.longitude],
            };

            const query: any = {
                "location": {
                    $near: {
                        $geometry: point,
                        $maxDistance: maxDistance,
                    }
                }
            };

            if (ownerId) {
                query.owner = ownerId;
            }

            const regions = await this.collection.find(query).exec();

            return regions.map((region) => RegionMapper.toDomainFromSchema(region));
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list regions near the point: ${JSON.stringify(coordinates)} - ` + error
            );
        }
    }


    public async save(region: Region): Promise<Region> {
        try {
            const mappedSchema = RegionMapper.toSchemaFromDomain(region);
            const regionDocument = new this.collection(mappedSchema);
            await regionDocument.save();
            return RegionMapper.toDomainFromSchema(regionDocument);
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to save a new region - ` + error
            );
        }
    }

    public async update(id: string, region: Region): Promise<void> {
        try {
            const mappedRegion = RegionMapper.toSchemaFromDomain(region);

            const updatedRegion = await this.collection.findByIdAndUpdate(
                id,
                {$set: mappedRegion},
                {new: true, runValidators: true, lean: true}
            ).exec();

            if (!updatedRegion) {
                throw new RegionException(`Failed to update region with id: ${id}`);
            }
        } catch (error) {
            if (error instanceof RegionException) {
                throw error;
            }

            throw new DatabaseException(
                `MongoDB error when trying to update region by id: ${id} - ${error}`
            );
        }
    }


    public async delete(id: string): Promise<void> {
        try {
            await this.collection.findByIdAndDelete(id).exec();
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to delete region by id: ${id} - `
                + error
            );
        }
    }

}