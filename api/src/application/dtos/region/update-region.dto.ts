import { IsOptional, IsArray, IsString, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { User } from "../../../domain/models/user.model";
import {GeoJSON} from "../../../domain/models/geo-json.model";
import LinearRing = GeoJSON.LinearRing;

export class UpdateRegionDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray({ message: "Coordinates must be an array." })
    coordinates?: LinearRing[];

    @IsOptional()
    @IsString()
    ownerId?: string;

    constructor(name?: string, coordinates?: LinearRing[], ownerId?: string) {
        this.name = name;
        this.coordinates = coordinates;
        this.ownerId = ownerId;
    }
}
