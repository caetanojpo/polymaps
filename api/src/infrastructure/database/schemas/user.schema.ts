import {prop, getModelForClass, pre} from '@typegoose/typegoose';
import {ValidateLocationException} from "../../../domain/exceptions/validate-location.exception";
import {Coordinates} from "../../../domain/types/coordinates.type";
import { BaseSchema} from "./base.schema";
import mongoose from "mongoose";


pre<UserSchema>("validate", function (this: mongoose.Document & UserSchema, next) {
    const hasAddress = !!this.address;
    const hasCoordinates = !!this.coordinates;

    if ((hasAddress && hasCoordinates) || (!hasAddress && !hasCoordinates)) {
        throw new ValidateLocationException("Either address or coordinates must be provided.");
    }
    next();
})

export class UserSchema extends BaseSchema {
    @prop({required: true})
    public name!: string;

    @prop({required: true, unique: true, lowercase: true})
    public email!: string;

    @prop({required: true})
    public hashedPassword!: string;

    @prop()
    public address?: string;

    @prop()
    public coordinates?: Coordinates;

    @prop({default: true})
    public isActive!: boolean;

    @prop({default: () => new Date(), immutable: true})
    public createdAt!: Date;

    @prop({default: () => new Date()})
    public updatedAt!: Date;
}

export const UserModel = getModelForClass(UserSchema);
