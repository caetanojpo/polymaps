import { registerDecorator, ValidationOptions, ValidationArguments } from 'class-validator';
import { logger } from "../../config/logger";

export function GeometryValidation(validationOptions?: ValidationOptions) {
    return function (object: object, propertyName: string) {
        registerDecorator({
            name: 'GeometryValidation',
            target: object.constructor,
            propertyName: propertyName,
            options: validationOptions,
            validator: {
                validate(value: any, args: ValidationArguments) {
                    logger.info(`Validating Geometry Polygon format for property: ${propertyName}`);
                    let errorMessage = '';

                    if (!Array.isArray(value) || value.length === 0 || !Array.isArray(value[0]) || !Array.isArray(value[0][0])) {
                        errorMessage = `${propertyName} must be a 3D array (GeoJSON Polygon).`;
                    } else {
                        const polygon = value[0];

                        for (let i = 0; i < polygon.length; i++) {
                            const coordinatePair = polygon[i];
                            if (!Array.isArray(coordinatePair) || coordinatePair.length !== 2) {
                                errorMessage = `Coordinate at index ${i} must be an array of two numbers.`;
                                break;
                            }
                            const [longitude, latitude] = coordinatePair;
                            if (typeof longitude !== 'number' || typeof latitude !== 'number') {
                                errorMessage = `Coordinate at index ${i} contains invalid data types.`;
                                break;
                            }
                        }

                        if (!errorMessage) {
                            const first = polygon[0];
                            const last = polygon[polygon.length - 1];
                            if (first[0] !== last[0] || first[1] !== last[1]) {
                                errorMessage = "First and last coordinates must match (polygon is not closed).";
                            }
                        }
                    }

                    if (errorMessage) {
                        logger.error(`Validation failed: ${errorMessage}`);
                        const dtoInstance = args.object as any;
                        dtoInstance.__geoValidationError = errorMessage;
                        return false;
                    }

                    return true;
                },
                defaultMessage(args: ValidationArguments) {
                    const dtoInstance = args.object as any;
                    return dtoInstance.__geoValidationError || 'Coordinates must be a valid GeoJSON Polygon.';
                },
            },
        });
    };
}