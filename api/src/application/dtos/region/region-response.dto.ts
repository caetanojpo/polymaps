import {Expose} from "class-transformer";
import {UserResponseDTO} from "../users/user-response.dto";
import {PolygonModelImpl} from "../../../domain/models/polygon.model";

export class RegionResponseDTO {
    @Expose()
    public readonly _id?: string;

    @Expose()
    name: string;

    @Expose()
    location: PolygonModelImpl;

    @Expose()
    owner: UserResponseDTO;

    @Expose()
    createdAt?: Date;

    @Expose()
    updatedAt?: Date;

    constructor(
        id: string,
        name: string,
        location: PolygonModelImpl,
        owner: UserResponseDTO,
        createdAt: Date,
        updatedAt: Date
    ) {
        this._id = id;
        this.name = name;
        this.location = location;
        this.owner = owner;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
