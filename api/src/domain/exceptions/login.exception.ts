export class LoginException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'LoginException';
        Object.setPrototypeOf(this, LoginException.prototype);
    }
}