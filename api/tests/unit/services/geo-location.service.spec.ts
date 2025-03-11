import { GeolocationService } from "../../../src/infrastructure/services/geolocation.service";
import { CoordinatesException } from "../../../src/domain/exceptions/coordinates.exception";
import { logger } from "../../../src/config/logger";

jest.mock('../../../src/config/logger', () => ({
    logger: {
        info: jest.fn(),
        warn: jest.fn(),
        error: jest.fn(),
    },
}));

describe('GeolocationService', () => {
    let geolocationService: GeolocationService;
    let mockedGeocoder: {
        geocode: jest.Mock;
        reverse: jest.Mock;
    };

    beforeEach(() => {
        jest.clearAllMocks();
        geolocationService = GeolocationService.getInstance();
        mockedGeocoder = {
            geocode: jest.fn(),
            reverse: jest.fn(),
        };
        (geolocationService as any).geocoder = mockedGeocoder;
    });

    describe('getCoordinatesFromAddress', () => {
        it('should return coordinates if address is valid', async () => {
            const address = 'Some valid address';
            const mockResponse = [{ latitude: 51.5074, longitude: -0.1278 }];
            mockedGeocoder.geocode.mockResolvedValue(mockResponse);

            const result = await geolocationService.getCoordinatesFromAddress(address);

            expect(result).toEqual({ latitude: 51.5074, longitude: -0.1278 });
            expect(mockedGeocoder.geocode).toHaveBeenCalledWith(address);
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return null if no coordinates are found', async () => {
            const address = 'Nonexistent address';
            mockedGeocoder.geocode.mockResolvedValue([]);

            const result = await geolocationService.getCoordinatesFromAddress(address);

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(`No results found for address: ${address}`);
        });

        it('should throw CoordinatesException if an error occurs', async () => {
            const address = 'Some address';
            const error = new Error('Some error');
            mockedGeocoder.geocode.mockRejectedValue(error);

            await expect(geolocationService.getCoordinatesFromAddress(address))
                .rejects
                .toThrowError(new CoordinatesException(`Failed to get coordinates for address: ${address}`));
            expect(logger.error).toHaveBeenCalledWith(`Error getting coordinates from address "${address}": ${error}`);
        });
    });

    describe('getAddressFromCoordinates', () => {
        it('should return address if coordinates are valid', async () => {
            const latitude = 51.5074;
            const longitude = -0.1278;
            const mockResponse = [{ formattedAddress: 'Some address' }];
            mockedGeocoder.reverse.mockResolvedValue(mockResponse);

            const result = await geolocationService.getAddressFromCoordinates(latitude, longitude);

            expect(result).toBe('Some address');
            expect(mockedGeocoder.reverse).toHaveBeenCalledWith({ lat: latitude, lon: longitude });
            expect(logger.warn).not.toHaveBeenCalled();
        });

        it('should return null if no address is found', async () => {
            const latitude = 51.5074;
            const longitude = -0.1278;
            mockedGeocoder.reverse.mockResolvedValue([]);

            const result = await geolocationService.getAddressFromCoordinates(latitude, longitude);

            expect(result).toBeNull();
            expect(logger.warn).toHaveBeenCalledWith(`No results found for coordinates: ${latitude}, ${longitude}`);
        });

        it('should throw CoordinatesException if an error occurs', async () => {
            const latitude = 51.5074;
            const longitude = -0.1278;
            const error = new Error('Some error');
            mockedGeocoder.reverse.mockRejectedValue(error);

            await expect(geolocationService.getAddressFromCoordinates(latitude, longitude))
                .rejects
                .toThrowError(new CoordinatesException(`Failed to get address for coordinates: (${latitude}, ${longitude})`));
            expect(logger.error).toHaveBeenCalledWith(`Error getting address for coordinates (${latitude}, ${longitude}): ${error}`);
        });
    });
});
