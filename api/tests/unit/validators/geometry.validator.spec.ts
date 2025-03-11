import { validateSync } from 'class-validator';
import { GeometryValidation } from '../../../src/infrastructure/validators/geometry.validator';
import { logger } from '../../../src/config/logger';

class DummyDto {
    @GeometryValidation()
    geometry: any;
}

describe('GeometryValidation Decorator', () => {
    let infoSpy: jest.SpyInstance;
    let errorSpy: jest.SpyInstance;

    beforeEach(() => {
        jest.clearAllMocks();
        infoSpy = jest.spyOn(logger, 'info').mockImplementation(() => logger);
        errorSpy = jest.spyOn(logger, 'error').mockImplementation(() => logger);
    });

    it('should pass validation for a valid GeoJSON Polygon', () => {
        const validPolygon = [
            [
                [0, 0],
                [1, 1],
                [0, 0]
            ]
        ];
        const dto = new DummyDto();
        dto.geometry = validPolygon;

        const errors = validateSync(dto);
        expect(errors.length).toBe(0);
        expect(infoSpy).toHaveBeenCalledWith('Validating Geometry Polygon format for property: geometry');
    });

    it('should fail validation if the value is not a 3D array', () => {
        const invalidGeometry = [0, 1, 2];
        const dto = new DummyDto();
        dto.geometry = invalidGeometry;

        const errors = validateSync(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toEqual({
            GeometryValidation: 'geometry must be a 3D array (GeoJSON Polygon).'
        });
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should fail validation if a coordinate pair does not have exactly 2 numbers', () => {
        const invalidPolygon = [
            [
                [0, 0],
                [1, 1, 1],
                [0, 0]
            ]
        ];
        const dto = new DummyDto();
        dto.geometry = invalidPolygon;

        const errors = validateSync(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toEqual({
            GeometryValidation: 'Coordinate at index 1 must be an array of two numbers.'
        });
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should fail validation if a coordinate pair contains non-numeric values', () => {
        const invalidPolygon = [
            [
                [0, 0],
                ['a', 'b'],
                [0, 0]
            ]
        ];
        const dto = new DummyDto();
        dto.geometry = invalidPolygon;

        const errors = validateSync(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toEqual({
            GeometryValidation: 'Coordinate at index 1 contains invalid data types.'
        });
        expect(errorSpy).toHaveBeenCalled();
    });

    it('should fail validation if the polygon is not closed (first and last coordinates do not match)', () => {
        const invalidPolygon = [
            [
                [0, 0],
                [1, 1],
                [2, 2]
            ]
        ];
        const dto = new DummyDto();
        dto.geometry = invalidPolygon;

        const errors = validateSync(dto);
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].constraints).toEqual({
            GeometryValidation: 'First and last coordinates must match (polygon is not closed).'
        });
        expect(errorSpy).toHaveBeenCalled();
    });
});
