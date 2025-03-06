import {Coordinates} from "../types/coordinates.type";
import {User} from "./user.model";
import {CoordinatesException} from "../exceptions/coordinates.exception";

export class Region {
    private readonly _id: string;
    private _name: string;
    private readonly _coordinates: Coordinates[];
    private _user: User;
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    constructor(
        id: string,
        name: string,
        coordinates: Coordinates[],
        user: User,
        isActive = true,
        createdAt = new Date(),
        updatedAt = new Date()) {
        this._id = id;
        this._name = name;
        this._coordinates = coordinates ?? [];
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

    get coordinates(): Coordinates[] {
        return [...this._coordinates];
    }

    get user(): User {
        return this._user;
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
