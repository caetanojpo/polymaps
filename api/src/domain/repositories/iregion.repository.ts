import {Region} from "../models/region.model";
import {Coordinates} from "../types/coordinates.type";

export interface IRegionRepository {
    findById(id: string): Promise<Region | null>;

    findAll(ownerId?: string): Promise<Region[]>;

    findRegionsContainingPoint(coordinates: Coordinates): Promise<Region[]>;

    findRegionsNearPoint(coordinates: Coordinates, maxDistance: number, ownerId?: string): Promise<Region[]>;

    save(region: Region): Promise<Region>;

    update(id: string, region: Region): Promise<void>;

    delete(id: string): Promise<void>;
}