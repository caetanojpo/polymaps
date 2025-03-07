import {
    IsEmail,
    IsNotEmpty, IsOptional,
    IsString,
    Matches,
    MinLength, ValidateIf,
} from 'class-validator';
import {Coordinates} from "../../../domain/types/coordinates.type";

export class CreateUserDTO {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @MinLength(6)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
        message:
            'Password must have at least 6 characters, one uppercase letter, one number, and one special symbol',
    })
    password: string;

    @ValidateIf((o) => !o.coordinates)
    @IsOptional()
    @IsString()
    address?: string;

    @ValidateIf((o) => !o.address)
    @IsOptional()
    coordinates?: Coordinates;

    constructor(name: string, email: string, password: string, address?: string, coordinates?: Coordinates) {
        this.name = name;
        this.email = email;
        this.password = password;
        this.address = address;
        this.coordinates = coordinates;
    }
}