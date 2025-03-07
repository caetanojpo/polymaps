import {Coordinates} from "../types/coordinates.type";
import {User} from "./user.model";
import {CoordinatesException} from "../exceptions/coordinates.exception";
import {Geometry} from "../types/geometry.type";

export class Region {
    private readonly _id: string;
    private _name: string;
    private readonly _coordinates: Geometry;
    private _user: User;
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(
        id: string,
        name: string,
        coordinates: Coordinates[][][],  // Expecting GeoJSON Polygon type
        user: User,
        isActive = true,
        createdAt = new Date(),
        updatedAt = new Date()
    ) {
        if (!coordinates || coordinates.length === 0) {
            throw new CoordinatesException("Coordinates must be provided.");
        }

        this._id = id;
        this._name = name;
        this._coordinates = {type: "Polygon", coordinates};
        this._user = user;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }


    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get user(): User {
        return this._user;
    }

    get coordinates(): Geometry {
        return this._coordinates;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set name(value: string) {
        this._name = value;
    }

    set user(value: User) {
        this._user = value;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    set updatedAt(value: Date) {
        this._updatedAt = value;
    }

    //THEORETICAL STUFF I MUST TEST LATER
    // public removeCoordinate(ringIndex: number, coordinateIndex: number): void {
    //     if (ringIndex < 0 || ringIndex >= this._coordinates.coordinates.length) {
    //         throw new CoordinatesException("Invalid ring index.");
    //     }
    //     if (coordinateIndex < 0 || coordinateIndex >= this._coordinates.coordinates[ringIndex].length) {
    //         throw new CoordinatesException("Invalid coordinate index.");
    //     }
    //     this._coordinates.coordinates[ringIndex].splice(coordinateIndex, 1);
    // }
    //
    // public updateCoordinate(ringIndex: number, coordinateIndex: number, newCoordinate: Coordinates[]): void {
    //     if (ringIndex < 0 || ringIndex >= this._coordinates.coordinates.length) {
    //         throw new CoordinatesException("Invalid ring index.");
    //     }
    //     if (coordinateIndex < 0 || coordinateIndex >= this._coordinates.coordinates[ringIndex].length) {
    //         throw new CoordinatesException("Invalid coordinate index.");
    //     }
    //     this._coordinates.coordinates[ringIndex][coordinateIndex] = newCoordinate;
    // }

}
