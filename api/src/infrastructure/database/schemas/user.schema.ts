import {prop, getModelForClass, modelOptions} from '@typegoose/typegoose';
import {Coordinates} from "../../../domain/types/coordinates.type";
import {BaseSchema} from "./base.schema";

@modelOptions({options: {customName: 'users'}})
export class UserSchema extends BaseSchema {
    @prop({required: true})
    public name!: string;

    @prop({required: true, unique: true, lowercase: true})
    public email!: string;

    @prop({required: true})
    public hashedPassword!: string;

    @prop()
    public address!: string;

    @prop()
    public coordinates!: Coordinates;

    @prop({default: true})
    public isActive!: boolean;
}

export const UserModel = getModelForClass(UserSchema);
