import {Region} from "../../../domain/models/region.model";
import {IRegionRepository} from "../../../domain/repositories/iregion.repository";
import {Coordinates} from "../../../domain/types/coordinates.type";
import {RegionModel} from "../schemas/region.schema";
import {DatabaseException} from "../../../domain/exceptions/database.exception";
import {RegionMapper} from "../../mapper/region.mapper";

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
            const regionDocument = await this.collection.findById(id).lean().exec();
            return regionDocument ? RegionMapper.toDomainFromSchema(regionDocument) : null

        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to find region by id ${id} - ` + error
            );
        }
    }

    public async findAll(allFromOwner: boolean): Promise<Region[]> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list all regions with filter from owner: ${allFromOwner} - ` + error
            );
        }
    }

    public async findAllByCoordinates(coordinates: Coordinates): Promise<Region[]> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list all regions by coordinates: ${JSON.stringify(coordinates)} - ` + error
            );
        }
    }

    public async findAllNearCoordinates(coordinates: Coordinates, filterNonOwner: boolean): Promise<Region[]> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to list all regions near the coordinates: ${JSON.stringify(coordinates)} - ` + error
            );
        }
    }

    public async save(region: Region): Promise<Region> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to save a new region - ` + error
            );
        }
    }

    public async update(id: string, region: Region): Promise<void> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to update region by id: ${id} - `
                + error
            );
        }
    }

    public async delete(id: string): Promise<void> {
        try {
        } catch (error) {
            throw new DatabaseException(
                `MongoDB error when trying to delete region by id: ${id} - `
                + error
            );
        }
    }

}