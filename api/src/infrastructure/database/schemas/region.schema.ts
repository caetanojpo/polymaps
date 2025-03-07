import {prop, getModelForClass, index, Ref, modelOptions} from '@typegoose/typegoose';
import {BaseSchema} from "./base.schema";
import {UserSchema} from "./user.schema";


@index({"coordinates.coordinates": "2dsphere"})
@modelOptions({options: {customName: 'regions'}})
export class RegionSchema extends BaseSchema {
    @prop({required: true})
    public name!: string;

    @prop({required: true, type: () => Object})
    public coordinates!: { type: "Polygon"; coordinates: number[][][] };

    @prop({ref: () => UserSchema, required: true, type: () => String})
    user!: Ref<UserSchema>;

    @prop({default: true})
    public isActive!: boolean;

    @prop({default: () => new Date(), immutable: true})
    public createdAt!: Date;

    @prop({default: () => new Date()})
    public updatedAt!: Date;
}

export const RegionModel = getModelForClass(RegionSchema);
