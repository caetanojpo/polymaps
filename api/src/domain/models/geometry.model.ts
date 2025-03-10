import {Expose} from "class-transformer";

export class Geometry {
    @Expose()
    type: "Polygon";

    @Expose()
    coordinates!: [[[number]]];


    constructor(type: "Polygon", coordinates: [[[number]]]) {
        this.type = type;
        this.coordinates = coordinates;
    }
}