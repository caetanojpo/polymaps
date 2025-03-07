import {GeolocationService} from "../../../infrastructure/services/geolocation.service";
import {logger} from "../../../config/logger";
import {User} from "../../../domain/models/user.model";

export class GeoLocationUseCase {
    private readonly geoService: GeolocationService;

    constructor() {
        this.geoService = GeolocationService.getInstance();
    }

    public async executeUserValidation(user: User): Promise<void> {
        logger.info(`Validating geolocation for user: ${user.email}`);

        if (!user.address && !user.coordinates) {
            logger.warn(`User ${user.email} has no address or coordinates. Skipping geolocation validation.`);
            return;
        }

        if (user.address && !user.coordinates) {
            logger.info(`No coordinates found for user ${user.email}, fetching coordinates from address: ${user.address}`);
            const coordinates = await this.geoService.getCoordinatesFromAddress(user.address);
            if (coordinates) {
                user.coordinates = coordinates;
                logger.info(`Coordinates for user ${user.email} fetched: ${JSON.stringify(user.coordinates)}`);
            } else {
                logger.warn(`Failed to fetch coordinates for user ${user.email}'s address: ${user.address}`);
            }
        }

        if (user.coordinates && !user.address) {
            logger.info(`No address found for user ${user.email}, fetching address from coordinates: ${JSON.stringify(user.coordinates)}`);
            const address = await this.geoService.getAddressFromCoordinates(user.coordinates.latitude, user.coordinates.longitude);
            if (address) {
                user.address = address;
                logger.info(`Address for user ${user.email} fetched: ${user.address}`);
            } else {
                logger.warn(`Failed to fetch address for user ${user.email}'s coordinates: ${JSON.stringify(user.coordinates)}`);
            }
        }
    }
}