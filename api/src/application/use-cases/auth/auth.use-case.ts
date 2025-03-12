import * as bcrypt from 'bcrypt';
import { UserRepository } from "../../../infrastructure/database/repositories/user.repository";
import { logger } from "../../../config/logger";
import { JwtService } from "../../../infrastructure/services/jwt.service";
import { LoginResponseDTO } from "../../dtos/auth/login-response.dto";
import { LoginException } from "../../../domain/exceptions/login.exception";


export class AuthUseCase {
    private readonly saltRounds = 10;
    private userRepository: UserRepository;
    private jwtService: JwtService;

    constructor(userRepository: UserRepository) {
        this.userRepository = userRepository;
        this.jwtService = JwtService.getInstance();
    }

    public async executeHashPassword(password: string): Promise<string> {
        logger.info("Hashing password with salt rounds: {}", this.saltRounds);
        return await bcrypt.hash(password, this.saltRounds);
    }

    public async executeValidatePassword(
        password: string,
        hashedPassword: string,
    ): Promise<boolean> {
        logger.info("Validating provided password against stored hashed password");
        const result = await bcrypt.compare(password, hashedPassword);
        if (result) {
            logger.info("Password validation successful.");
        } else {
            logger.warn("Password validation failed.");
        }
        return result;
    }

    public async executeLogin(email: string, password: string): Promise<LoginResponseDTO> {
        logger.info("Initiating login process for user with email: {}", email);
        const user = await this.userRepository.findByEmail(email);
        if (!user?._id || !user.isActive) {
            logger.warn("Login attempt failed for user {}: User not found or inactive", email);
            throw new LoginException("Invalid credentials");
        }

        const isMatch = await this.executeValidatePassword(
            password,
            user.hashedPassword
        );

        if (!isMatch) {
            logger.warn("Login attempt failed for user {}: Invalid password", email);
            throw new LoginException("Invalid credentials");
        }

        logger.info("Password matched for user {}. Generating JWT token.", email);
        const token = this.jwtService.generateToken(user._id);
        logger.info("Token successfully generated for user {}: {}", email, token);

        return new LoginResponseDTO(user._id, token);
    }
}
