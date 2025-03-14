import {Coordinates} from "../../../domain/types/coordinates.type";
import {Expose} from "class-transformer";

export class UserResponseDTO {
    @Expose()
    public readonly _id?: string;
    @Expose()
    name: string;
    @Expose()
    email: string;
    @Expose()
    address?: string;
    @Expose()
    coordinates?: Coordinates;
    @Expose()
    createdAt?: Date;
    @Expose()
    updatedAt?: Date;

    constructor(id: string, name: string, email: string, address: string, coordinates: Coordinates, createdAt: Date, updatedAt: Date) {
        this._id = id;
        this.name = name;
        this.email = email;
        this.address = address;
        this.coordinates = coordinates;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}