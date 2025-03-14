export type SearchParams =
    | {
    type: 'contains';
    coordinates: { latitude: number; longitude: number };
}
    | {
    type: 'near';
    coordinates: { latitude: number; longitude: number };
    options: {
        maxDistance: number;
        fromOwner: boolean;
    };
};