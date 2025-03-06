import {Coordinates} from "../types/coordinates.type";
import {ValidateLocationException} from "../exceptions/validate-location.exception";

export class User{
    private readonly _id?: string;
    private _name: string;
    private _email: string;
    private _hashedPassword: string;
    private _address?: string;
    private _coordinates?: Coordinates;
    private _isActive: boolean;
    private readonly _createdAt: Date;
    private _updatedAt: Date;

    private constructor(
        id: string | undefined,
        name: string,
        email: string,
        hashedPassword: string,
        address?: string,
        coordinates?: Coordinates,
        isActive = true,
        createdAt = new Date(),
        updatedAt = new Date()
    ) {
        this.validateLocation(address, coordinates);

        this._id = id;
        this._name = name;
        this._email = email;
        this._hashedPassword = hashedPassword;
        this._address = address;
        this._coordinates = coordinates;
        this._isActive = isActive;
        this._createdAt = createdAt;
        this._updatedAt = updatedAt;
    }

    private validateLocation(address?: string, coordinates?: Coordinates): void {
        if ((address && coordinates) || (!address && !coordinates)) {
            throw new ValidateLocationException("Either address or coordinates must be provided.");
        }
    }

    get id(): string | undefined {
        return this._id;
    }

    get createdAt(): Date {
        return this._createdAt;
    }

    get name(): string {
        return this._name;
    }

    get email(): string {
        return this._email;
    }

    get hashedPassword(): string {
        return this._hashedPassword;
    }

    get address(): string | undefined {
        return this._address;
    }

    get coordinates(): Coordinates | undefined {
        return this._coordinates;
    }

    get isActive(): boolean {
        return this._isActive;
    }

    get updatedAt(): Date {
        return this._updatedAt;
    }

    set name(value: string) {
        this._name = value;
    }

    set email(value: string) {
        this._email = value;
    }

    set hashedPassword(value: string) {
        this._hashedPassword = value;
    }

    set address(value: string | undefined) {
        this._address = value;
    }

    set coordinates(value: Coordinates | undefined) {
        this._coordinates = value;
    }

    set isActive(value: boolean) {
        this._isActive = value;
    }

    set updatedAt(value: Date) {
        this._updatedAt = value;
    }
}