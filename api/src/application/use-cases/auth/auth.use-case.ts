import * as bcrypt from 'bcrypt';
import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {logger} from "../../../config/logger";


export class AuthUseCase {
    private readonly saltRounds = 10;
    private userRepository: UserRepository;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
    }

    public async executeHashPassword(password: string): Promise<string> {
        logger.info("Hashing password");
        return await bcrypt.hash(password, this.saltRounds);
    }

    public async executeValidatePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        logger.info("Validating password");
        return bcrypt.compare(password, hashedPassword);
    }
}