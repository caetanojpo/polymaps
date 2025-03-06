export class EntityNotFoundException extends Error {
    constructor(entity: string, id?: string | number) {
        const message = id
            ? `${entity} with ID ${id} not found.`
            : `${entity} not found.`;
        super(message);
        this.name = 'EntityNotFoundException';
        Object.setPrototypeOf(this, EntityNotFoundException.prototype);
    }
}