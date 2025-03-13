import {prop, getModelForClass, index, Ref, modelOptions} from '@typegoose/typegoose';
import {BaseSchema} from "./base.schema";
import {UserSchema} from "./user.schema";
import {PolygonSchema} from "./polygon.schema";


@modelOptions({options: {customName: 'regions'}})
@index({"location": "2dsphere"})
export class RegionSchema extends BaseSchema {
    @prop({required: true})
    public name!: string;

    @prop({_id: false, type: PolygonSchema})
    public location!: PolygonSchema;

    @prop({ref: () => UserSchema, required: true, type: () => String})
    public owner!: Ref<UserSchema>;

    @prop({default: true})
    public isActive!: boolean;

    @prop({default: () => new Date(), immutable: true})
    public createdAt!: Date;

    @prop({default: () => new Date()})
    public updatedAt!: Date;
}

export const RegionModel = getModelForClass(RegionSchema);
