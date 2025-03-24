import { sign, verify } from 'jsonwebtoken';
import { JwtService } from "../../../src/infrastructure/services/jwt.service";

jest.mock("../../../src/config/env", () => ({
    ENV: {
        JWT_SECRET: "test_secret",
    },
}));

describe("JwtService", () => {
    let jwtService: JwtService;

    beforeEach(() => {
        jwtService = JwtService.getInstance();
    });

    describe("generateToken", () => {
        it("should generate a token string that contains the correct payload", () => {
            const userId = "user123";
            const token = jwtService.generateToken(userId);

            expect(typeof token).toBe("string");

            const decoded = verify(token, "test_secret") as { userId: string };
            expect(decoded.userId).toBe(userId);
        });
    });

    describe("verifyToken", () => {
        it("should return the payload when given a valid token", () => {
            const userId = "user456";
            const token = sign({ userId }, "test_secret", { expiresIn: "10m" });
            const payload = jwtService.verifyToken(token);

            expect(payload.userId).toBe(userId);
        });

        it("should throw an error if the token is invalid", () => {
            const invalidToken = "invalid.token.here";
            expect(() => jwtService.verifyToken(invalidToken)).toThrowError("Invalid token");
        });
    });
});
