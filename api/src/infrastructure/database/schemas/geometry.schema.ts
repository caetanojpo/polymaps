import {prop} from "@typegoose/typegoose";
import {Expose} from "class-transformer";

export class GeometrySchema {
    @Expose()
    @prop({ required: true, enum: ['Polygon'], default: 'Polygon' })
    public type!: 'Polygon';

    @Expose()
    @prop({ required: true, type: [[[Number]]] })
    public coordinates!:  [[[number]]];
}