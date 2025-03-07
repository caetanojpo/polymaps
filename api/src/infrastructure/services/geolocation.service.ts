import NodeGeocoder, {Options, Geocoder} from 'node-geocoder';
import {CoordinatesException} from "../../domain/exceptions/coordinates.exception";
import {logger} from "../../config/logger";

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
            const results = await this.geocoder.geocode(address);
            if (results.length > 0) {
                const { latitude, longitude } = results[0];
                if (latitude && longitude) {
                    return { latitude, longitude };
                }
                return null;
            }
            logger.warn(`No results found for address: ${address}`);
            return null;
        } catch (error) {
            logger.error(`Error getting coordinates from address "${address}": ${error}`);
            throw new CoordinatesException(`Failed to get coordinates for address: ${address}`);
        }
    }

    public async getAddressFromCoordinates(latitude: number, longitude: number): Promise<string | null> {
        try {
            const results = await this.geocoder.reverse({ lat: latitude, lon: longitude });
            if (results.length > 0) {
                return results[0].formattedAddress ?? null;
            }
            logger.warn(`No results found for coordinates: ${latitude}, ${longitude}`);
            return null;
        } catch (error) {
            logger.error(`Error getting address for coordinates (${latitude}, ${longitude}): ${error}`);
            throw new CoordinatesException(`Failed to get address for coordinates: (${latitude}, ${longitude})`);
        }
    }
}
