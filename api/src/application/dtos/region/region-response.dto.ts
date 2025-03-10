import { Expose } from "class-transformer";
import { User } from "../../../domain/models/user.model";
import { Geometry } from "../../../domain/types/geometry.type";

export class RegionResponseDTO {
    @Expose()
    _id?: string;

    @Expose()
    name: string;

    @Expose()
    coordinates: [[[number]]];

    @Expose()
    owner: User;

    @Expose()
    isActive?: boolean;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;

    constructor(
        id: string,
        name: string,
        coordinates: [[[number]]],
        owner: User,
        isActive: boolean,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = id;
        this.name = name;
        this.coordinates = coordinates;
        this.owner = owner;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
