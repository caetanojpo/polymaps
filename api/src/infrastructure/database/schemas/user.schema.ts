import {prop, getModelForClass, pre} from '@typegoose/typegoose';
import {ValidateLocationException} from "../../../domain/exceptions/validate-location.exception";
import {Coordinates} from "../../../domain/types/coordinates.type";
import { BaseSchema} from "./base.schema";


@pre<UserSchema>('save', async function (next) {
    if ((this.address && this.coordinates) || (!this.address && !this.coordinates)) {
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
