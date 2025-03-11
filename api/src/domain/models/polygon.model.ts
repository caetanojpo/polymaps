import {Expose} from "class-transformer";
import {GeoJSON} from "./geo-json.model";
import Polygon = GeoJSON.Polygon;
import LinearRing = GeoJSON.LinearRing;

export class PolygonModelImpl implements Polygon {
    @Expose()
    type: "Polygon";

    @Expose()
    coordinates!: LinearRing[];


    constructor(type: "Polygon", coordinates: LinearRing[]) {
        this.type = type;
        this.coordinates = coordinates;
    }

    [x: number]: unknown;
    [x: string]: unknown;
    bbox?: number[] | undefined;
}