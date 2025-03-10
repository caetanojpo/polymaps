import {IsNotEmpty, IsNumber, IsOptional, IsString} from "class-validator";

export class ListRegionsNearPointDTO {
    @IsNotEmpty()
    @IsNumber()
    latitude: number;

    @IsNotEmpty()
    @IsNumber()
    longitude: number;

    constructor(latitude: number, longitude: number) {
        this.latitude = latitude;
        this.longitude = longitude;
    }
}
