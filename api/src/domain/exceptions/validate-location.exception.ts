export class ValidateLocationException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'ValidateLocationException';
        Object.setPrototypeOf(this, ValidateLocationException.prototype);
    }
}