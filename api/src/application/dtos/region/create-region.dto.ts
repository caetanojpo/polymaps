import {IsNotEmpty, IsString, IsArray, Validate} from "class-validator";
import {
    GeometryValidation
} from "../../../infrastructure/validators/geometry.validator";

export class CreateRegionDto {
    @IsNotEmpty({message: "Region name is required."})
    name: string;

    @IsNotEmpty({message: "Coordinates are required."})
    @IsArray({message: "Coordinates must be an array."})
    @GeometryValidation()
    coordinates: [[[number]]];

    @IsNotEmpty({message: "An owner is required. Inform the user ID"})
    @IsString({message: "Owner must be a string (ID)."})
    owner: string;

    constructor(name: string, coordinates: [[[number]]], owner: string) {
        this.name = name;
        this.coordinates = coordinates;
        this.owner = owner;
    }
}
