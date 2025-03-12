export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Geometry {
    type: 'Polygon';
    coordinates: number[][][];
}

export interface User {
    id: string;
    name: string;
    email: string;
    address?: string;
    coordinates?: Coordinates;
    createdAt: Date;
    updatedAt: Date;
}

export interface Region {
    id: string;
    name: string;
    location: Geometry;
    owner: User;
    createdAt: Date;
    updatedAt: Date;
}