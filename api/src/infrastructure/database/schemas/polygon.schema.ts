import {prop} from "@typegoose/typegoose";
import {Expose} from "class-transformer";


export class PolygonSchema {
    @Expose()
    @prop({required: true, enum: ['Polygon'], default: 'Polygon'})
    public type!: 'Polygon';

    @Expose()
    @prop({required: true, type:[[[Number]]], ref: 'Polygon'})
    public coordinates!: number[][][]
    ;
}