export class ValidateLocationException extends Error {
    constructor(entity: string, id?: string | number) {
        const message = id
            ? `${entity} with ID ${id} not found.`
            : `${entity} not found.`;
        super(message);
        this.name = 'ValidateLocationException';
        Object.setPrototypeOf(this, ValidateLocationException.prototype);
    }
}