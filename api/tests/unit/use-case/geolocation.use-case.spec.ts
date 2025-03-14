import {GeoLocationUseCase} from "../../../src/application/use-cases/geolocation/geo-location.use-case";
import {GeolocationService} from "../../../src/infrastructure/services/geolocation.service";
import {User} from "../../../src/domain/models/user.model";

jest.mock("../../../src/infrastructure/services/geolocation.service");

describe("GeoLocationUseCase", () => {
    let geoLocationUseCase: GeoLocationUseCase;
    let geoService: jest.Mocked<GeolocationService>;

    beforeEach(() => {
        geoService = {
            getCoordinatesFromAddress: jest.fn(),
            getAddressFromCoordinates: jest.fn(),
        } as unknown as jest.Mocked<GeolocationService>;

        (GeolocationService.getInstance as jest.Mock).mockReturnValue(geoService);

        geoLocationUseCase = new GeoLocationUseCase();
    });

    it("should skip geolocation validation if user has no address and no coordinates", async () => {
        const user: User = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "Test123!",
            address: undefined,
            coordinates: undefined
        };

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getCoordinatesFromAddress).not.toHaveBeenCalled();
        expect(geoService.getAddressFromCoordinates).not.toHaveBeenCalled();
    });

    it("should fetch coordinates when user has an address but no coordinates", async () => {
        const user: User = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "Test123!",
            address: "ABC 123",
            coordinates: undefined
        };
        const mockCoordinates = {latitude: 12.34, longitude: 56.78};
        geoService.getCoordinatesFromAddress.mockResolvedValue(mockCoordinates);

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getCoordinatesFromAddress).toHaveBeenCalledWith("ABC 123");
        expect(user.coordinates).toEqual(mockCoordinates);
    });

    it("should fetch address when user has coordinates but no address", async () => {
        const user: User = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "Test123!",
            address: undefined,
            coordinates: {latitude: 12.34, longitude: 56.78}
        };
        const mockAddress = "ABC 123";
        geoService.getAddressFromCoordinates.mockResolvedValue(mockAddress);

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getAddressFromCoordinates).toHaveBeenCalledWith(12.34, 56.78);
        expect(user.address).toBe(mockAddress);
    });

    it("should not fetch geolocation data when user already has both address and coordinates", async () => {
        const user: User = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "Test123!",
            address: "ABC 123",
            coordinates: {latitude: 12.34, longitude: 56.78}
        };

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getCoordinatesFromAddress).not.toHaveBeenCalled();
        expect(geoService.getAddressFromCoordinates).not.toHaveBeenCalled();
    });

    it("should log a warning if fetching coordinates fails", async () => {
        const user: User = {
            email: "test@test.com",
            name: "test",
            hashedPassword: "Test123!",
            address: "ABC 123",
            coordinates: undefined
        };
        geoService.getCoordinatesFromAddress.mockResolvedValue(null);

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getCoordinatesFromAddress).toHaveBeenCalledWith("ABC 123");
        expect(user.coordinates).toBeUndefined();
    });

    it("should log a warning if fetching address fails", async () => {
        const user: User = {email: "test@test.com", name: "test", hashedPassword:"Test123!", address: undefined, coordinates: {latitude: 12.34, longitude: 56.78}};
        geoService.getAddressFromCoordinates.mockResolvedValue(null);

        await geoLocationUseCase.executeUserValidation(user);

        expect(geoService.getAddressFromCoordinates).toHaveBeenCalledWith(12.34, 56.78);
        expect(user.address).toBeUndefined();
    });
});
