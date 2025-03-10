import { IsOptional, IsArray, IsString, IsObject, ValidateNested } from "class-validator";
import { Type } from "class-transformer";
import { User } from "../../../domain/models/user.model";

export class UpdateRegionDto {
    @IsOptional()
    @IsString()
    name?: string;

    @IsOptional()
    @IsArray({ message: "Coordinates must be an array." })
    coordinates?: [[[number]]];

    @IsOptional()
    @ValidateNested()
    @Type(() => User)
    owner?: User;

    constructor(name?: string, coordinates?: [[[number]]], owner?: User) {
        this.name = name;
        this.coordinates = coordinates;
        this.owner = owner;
    }
}
