import {UserResponseDTO} from "../../src/application/dtos/users/user-response.dto";
import {Coordinates} from "../../src/domain/types/coordinates.type";

export const userResponseMock: UserResponseDTO = new UserResponseDTO(
    "user123",
    "Test User",
    "test@test.com",
    "123 Main Street",
    {latitude: 40.7128, longitude: -74.0060} as Coordinates,
    new Date("2023-01-01T00:00:00.000Z"),
    new Date("2023-01-02T00:00:00.000Z")
);

export const userResponseMockList: UserResponseDTO[] = [
    new UserResponseDTO(
        "user123",
        "Test User",
        "test@test.com",
        "123 Main Street",
        {latitude: 40.7128, longitude: -74.0060} as Coordinates,
        new Date("2023-01-01T00:00:00.000Z"),
        new Date("2023-01-02T00:00:00.000Z")
    ),
    new UserResponseDTO(
        "user124",
        "Test User 2",
        "test2@test.com",
        "456 Another Ave",
        {latitude: 41.0000, longitude: -75.0000} as Coordinates,
        new Date("2023-01-03T00:00:00.000Z"),
        new Date("2023-01-04T00:00:00.000Z")
    ),
    new UserResponseDTO(
        "user125",
        "Test User 3",
        "test3@test.com",
        "789 Example Blvd",
        {latitude: 42.1234, longitude: -76.5678} as Coordinates,
        new Date("2023-02-01T00:00:00.000Z"),
        new Date("2023-02-02T00:00:00.000Z")
    )
];
