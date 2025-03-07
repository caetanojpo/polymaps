import * as bcrypt from 'bcrypt';
import {UserRepository} from "../../../infrastructure/database/repositories/user.repository";
import {logger} from "../../../config/logger";
import {JwtService} from "../../../infrastructure/services/jwt.service";
import {LoginResponseDTO} from "../../dtos/auth/login-response.dto";
import {LoginException} from "../../../domain/exceptions/login.exception";


export class AuthUseCase {
    private readonly saltRounds = 10;
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.jwtService = JwtService.getInstance();
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

    public async executeLogin(email: string, password: string): Promise<LoginResponseDTO> {
        const user = await this.userRepository.findByEmail(email);
        if (!user?._id || !user.isActive) {
            throw new LoginException("Invalid credentials");
        }

        const isMatch = await this.executeValidatePassword(
            password,
            user.hashedPassword
        );

        if (!isMatch) {
            throw new LoginException("Invalid credentials");
        }

        logger.logFormatted("info", "Password matches for user: {}", user.email);
        const token = this.jwtService.generateToken(user._id);
        logger.logFormatted("info", "Token successfully generated: {}", token);

        return new LoginResponseDTO(user._id, token);
    }
}