import {prop} from "@typegoose/typegoose";

export class GeometrySchema {
    @prop({ required: true, enum: ['Polygon'], default: 'Polygon' })
    public type!: 'Polygon';

    @prop({ required: true, type: [[[Number]]] })
    public coordinates!:  [[[number]]];
}