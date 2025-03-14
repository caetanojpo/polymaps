import {IsNotEmpty, IsNumber} from "class-validator";

export class ListRegionsContainingPointDto {
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