import {IsNotEmpty, IsString, IsArray, Validate} from "class-validator";
import {
    GeometryValidation
} from "../../../infrastructure/validators/geometry.validator";
import {GeoJSON} from "../../../domain/models/geo-json.model";
import LinearRing = GeoJSON.LinearRing;

export class CreateRegionDto {
    @IsNotEmpty({message: "Region name is required."})
    name: string;

    @IsNotEmpty({message: "Coordinates are required."})
    @IsArray({message: "Coordinates must be an array."})
    @Validate(GeometryValidation)
    coordinates: LinearRing[];

    @IsNotEmpty({message: "An owner is required. Inform the user ID"})
    @IsString({message: "Owner must be a string (ID)."})
    owner: string;

    constructor(name: string, coordinates: LinearRing[], owner: string) {
        this.name = name;
        this.coordinates = coordinates;
        this.owner = owner;
    }
}
