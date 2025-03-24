export interface Coordinates {
    latitude: number;
    longitude: number;
}

export interface Geometry {
    type: 'Polygon';
    coordinates: number[][][];
}

export interface User {
    _id: string;
    name: string;
    email: string;
    address?: string;
    coordinates?: Coordinates;
    createdAt: Date;
    updatedAt: Date;
}

export interface Region {
    _id: string;
    name: string;
    location: Geometry;
    owner: User;
    createdAt: Date;
    updatedAt: Date;
}

export interface Point {
    lat: number;
    lng: number;
}
