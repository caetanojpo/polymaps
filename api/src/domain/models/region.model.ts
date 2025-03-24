import {User} from "./user.model";
import {Expose} from "class-transformer";
import {PolygonModelImpl} from "./polygon.model";

export class Region {
    @Expose()
    public readonly _id?: string;
    @Expose()
    public name: string;
    @Expose()
    public location: PolygonModelImpl;
    @Expose()
    public owner: User;
    @Expose()
    public isActive?: boolean;
    @Expose()
    public readonly createdAt?: Date;
    @Expose()
    public updatedAt?: Date;

    constructor(
        name: string,
        location: PolygonModelImpl,
        owner: User,
        id?: string,
        isActive?: boolean,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.name = name;
        this.location = location;
        this.owner = owner;
        this._id = id;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }
}
