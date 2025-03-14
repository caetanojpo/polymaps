import {IsEmail, IsNotEmpty, IsString, Matches, MinLength} from "class-validator";

export class LoginRequestDTO{
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsString()
    @MinLength(6)
    @Matches(/^(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/, {
        message:
            'Password must have at least 6 characters, one uppercase letter, one number, and one special symbol',
    })
    password: string;


    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}