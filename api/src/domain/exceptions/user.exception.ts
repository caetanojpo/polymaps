export class UserException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'UserException';
        Object.setPrototypeOf(this, UserException.prototype);
    }
}