export class CoordinatesException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'CoordinatesException';
        Object.setPrototypeOf(this, CoordinatesException.prototype);
    }
}