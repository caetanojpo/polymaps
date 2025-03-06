import {Coordinates} from "../types/coordinates.type";
import {User} from "./user.model";
import {CoordinatesException} from "../exceptions/coordinates.exception";

export class Region {
    private readonly _id: string;
    private _name: string;
    private readonly _coordinates: Coordinates[];
    private _user: User;

    constructor(id: string, name: string, coordinates: Coordinates[], user: User) {
        this._id = id;
        this._name = name;
        this._coordinates = coordinates ?? [];
        this._user = user;
    }

    get id(): string {
        return this._id;
    }

    get name(): string {
        return this._name;
    }

    get coordinates(): Coordinates[] {
        return [...this._coordinates];
    }

    get user(): User {
        return this._user;
    }

    set name(value: string) {
        this._name = value;
    }

    set user(value: User) {
        this._user = value;
    }

    public addCoordinates(coordinate: Coordinates): void {
        this._coordinates.push(coordinate);
    }

    public removeCoordinates(index: number): void {
        if (index < 0 || index >= this._coordinates.length) {
            throw new CoordinatesException("Invalid index.");
        }
        this._coordinates.splice(index, 1);
    }

    public updateCoordinates(index: number, newCoordinate: Coordinates): void {
        if (index < 0 || index >= this._coordinates.length) {
            throw new CoordinatesException("Invalid index.");
        }
        this._coordinates[index] = newCoordinate;
    }
}
