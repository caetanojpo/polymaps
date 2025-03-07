import {Coordinates} from "../types/coordinates.type";
import {User} from "./user.model";
import {Geometry} from "../types/geometry.type";

export class Region {
    private readonly _id?: string;
    private name: string;
    private coordinates: Geometry;
    private user: User;
    private isActive?: boolean;
    private readonly createdAt?: Date;
    private updatedAt?: Date;

    constructor(
        name: string,
        coordinates: Coordinates[][][],
        user: User,
        id?: string,
        isActive?: boolean,
        createdAt?: Date,
        updatedAt?: Date
    ) {
        this.name = name;
        this.coordinates = {type: "Polygon", coordinates};
        this.user = user;
        this._id = id;
        this.isActive = isActive;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
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
