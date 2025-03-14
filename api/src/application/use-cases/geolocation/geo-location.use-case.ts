import { GeolocationService } from "../../../infrastructure/services/geolocation.service";
import { logger } from "../../../config/logger";
import { User } from "../../../domain/models/user.model";

export class GeoLocationUseCase {
    private readonly geoService: GeolocationService;

    constructor() {
        this.geoService = GeolocationService.getInstance();
    }

    public async executeUserValidation(user: User): Promise<void> {
        logger.info(`Starting geolocation validation for user: ${user.email}`);

        if (!user.address && !user.coordinates) {
            logger.warn(`User ${user.email} has neither address nor coordinates. Skipping geolocation validation.`);
            return;
        }

        if (user.address && !user.coordinates) {
            logger.info(`User ${user.email} has address but no coordinates. Fetching coordinates from address: ${user.address}`);
            const coordinates = await this.geoService.getCoordinatesFromAddress(user.address);
            if (coordinates) {
                user.coordinates = coordinates;
                logger.info(`Successfully fetched coordinates for user ${user.email}: ${JSON.stringify(user.coordinates)}`);
            } else {
                logger.error(`Failed to fetch coordinates for user ${user.email} using address: ${user.address}`);
            }
        }

        if (user.coordinates && !user.address) {
            logger.info(`User ${user.email} has coordinates but no address. Fetching address from coordinates: ${JSON.stringify(user.coordinates)}`);
            const address = await this.geoService.getAddressFromCoordinates(user.coordinates.latitude, user.coordinates.longitude);
            if (address) {
                user.address = address;
                logger.info(`Successfully fetched address for user ${user.email}: ${user.address}`);
            } else {
                logger.error(`Failed to fetch address for user ${user.email} using coordinates: ${JSON.stringify(user.coordinates)}`);
            }
        }
    }
}
