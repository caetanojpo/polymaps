import {prop, Ref} from "@typegoose/typegoose";
import {Expose} from "class-transformer";
import {GeoJSON} from "../../../domain/models/geo-json.model";
import Polygon = GeoJSON.Polygon;
import LinearRing = GeoJSON.LinearRing;

export class PolygonSchema {
    @Expose()
    @prop({required: true, enum: ['Polygon'], default: 'Polygon'})
    public type!: 'Polygon';

    @Expose()
    @prop({required: true, type:[[[Number]]], ref: 'Polygon'})
    public coordinates!: number[][][]
    ;
}