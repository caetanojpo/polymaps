import {
    IsEmail, IsNotEmpty, IsObject,
    IsOptional,
    IsString,
    Matches,
    MinLength, ValidateIf, ValidateNested,
} from 'class-validator';
import {Coordinates} from "../../../domain/types/coordinates.type";
import {Type} from "class-transformer";

export class UpdateUserDTO {
    @IsOptional()
    @IsString({message: "Name must be a valid string."})
    name: string;

    @IsOptional()
    @IsEmail({}, {message: "Invalid email format."})
    email: string;

    @IsOptional()
    @MinLength(6, {message: "Password must be at least 6 characters long."})
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
        message: "Password must contain at least one uppercase letter, one number, and one special character."
    })
    password: string;

    @ValidateIf((o) => !o.coordinates)
    @IsOptional()
    @IsString({message: "Address must be a valid string."})
    address?: string;

    @ValidateIf((o) => !o.address)
    @IsOptional()
    @IsObject({message: "Coordinates must be a valid object."})
    @ValidateNested()
    @Type(() => Object)
    coordinates?: Coordinates;

    constructor(name: string, email: string, password: string, address?: string, coordinates?: Coordinates) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.coordinates = coordinates;
    }
}