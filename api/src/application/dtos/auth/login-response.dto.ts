import {Expose} from "class-transformer";

export class LoginResponseDTO {
    @Expose()
    id: string;

    @Expose()
    token: string;

    constructor(id: string, token: string) {
        this.id = id;
        this.token = token;
    }
}