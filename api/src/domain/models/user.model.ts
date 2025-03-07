import {Coordinates} from "../types/coordinates.type";
import {ValidateLocationException} from "../exceptions/validate-location.exception"
import {Expose} from "class-transformer";

export class User {
    @Expose()
    public readonly _id?: string;
    @Expose()
    public name: string;
    @Expose()
    public email: string;
    @Expose()
    public hashedPassword: string;
    @Expose()
    public address?: string;
    @Expose()
    public coordinates?: Coordinates;
    @Expose()
    public isActive?: boolean;
    @Expose()
    public readonly createdAt?: Date;
    @Expose()
    public updatedAt?: Date;


    constructor(name: string, email: string, hashedPassword: string, id: string, address?: string, coordinates?: Coordinates, isActive?: boolean, createdAt?: Date, updatedAt?: Date) {
        this.name = name;
        this.email = email;
        this.hashedPassword = hashedPassword;
        this._id = id;
        this.address = address;
        this.coordinates = coordinates;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public static validateLocation(address?: string, coordinates?: Coordinates): void {
        if (!address && !coordinates) {
            throw new ValidateLocationException("Either address or coordinates must be provided.");
        }
        if (address && coordinates) {
            throw new ValidateLocationException("You cannot provide both address and coordinates.");
        }
    }
}
