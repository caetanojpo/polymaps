import {User} from "../../../src/domain/models/user.model";

export const userMock: User = {
    email: "test@test.com",
    name: "test",
    hashedPassword: "password123",
    address: "ABC 123"
}