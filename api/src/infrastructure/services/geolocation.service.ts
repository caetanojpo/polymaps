import NodeGeocoder, { Options, Geocoder } from 'node-geocoder';
import { CoordinatesException } from "../../domain/exceptions/coordinates.exception";
import { logger } from "../../config/logger";

export class GeolocationService {
    private static instance: GeolocationService;
    private geocoder: Geocoder;

    constructor() {
        const options: Options = {
            provider: 'openstreetmap',
        };
        this.geocoder = NodeGeocoder(options);
    }

    public static getInstance(): GeolocationService {
        if (!GeolocationService.instance) {
            GeolocationService.instance = new GeolocationService();
        }
        return GeolocationService.instance;
    }

    public async getCoordinatesFromAddress(address: string): Promise<{ latitude: number; longitude: number } | null> {
        try {
            logger.info(`Attempting to get coordinates for address: ${address}`);
            const results = await this.geocoder.geocode(address);

            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                if (latitude && longitude) {
                    logger.info(`Successfully retrieved coordinates for address: ${address}`);
                    return { latitude, longitude };
                }
                logger.warn(`Coordinates not found for address: ${address}`);
                return null;
            }

            logger.warn(`No results found for address: ${address}`);
            return null;
        } catch (error) {
            logger.error(`Error getting coordinates for address: ${address}`, {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace available',
            });
            throw new CoordinatesException(`Failed to get coordinates for address: ${address}. Please check the address and try again.`);
        }
    }

    public async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
        try {
            logger.info(`Attempting to get address for coordinates: (${latitude}, ${longitude})`);
            const results = await this.geocoder.reverse({ lat: latitude, lon: longitude });

            if (results.length > 0) {
                const formattedAddress = results[0].formattedAddress ?? null;
                if (formattedAddress) {
                    logger.info(`Successfully retrieved address for coordinates: (${latitude}, ${longitude})`);
                    return formattedAddress;
                }
                logger.warn(`Address not found for coordinates: (${latitude}, ${longitude})`);
                return null;
            }

            logger.warn(`No results found for coordinates: (${latitude}, ${longitude})`);
            return null;
        } catch (error) {
            logger.error(`Error getting address for coordinates: (${latitude}, ${longitude})`, {
                error: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'No stack trace available',
            });
            throw new CoordinatesException(`Failed to get address for coordinates: (${latitude}, ${longitude}). Please check the coordinates and try again.`);
        }
    }
}
