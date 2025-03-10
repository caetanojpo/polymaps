export class RegionException extends Error {
    constructor(message: string) {
        super(message);
        this.name = 'RegionException';
        Object.setPrototypeOf(this, RegionException.prototype);
    }
}