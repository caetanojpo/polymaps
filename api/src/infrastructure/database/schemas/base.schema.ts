import * as mongoose from 'mongoose';
import {TimeStamps} from '@typegoose/typegoose/lib/defaultClasses';
import {modelOptions, Prop, Severity} from '@typegoose/typegoose';
import ObjectId = mongoose.Types.ObjectId;

@modelOptions({
    options: {
        allowMixed: Severity.ALLOW
    }
})
export class BaseSchema extends TimeStamps {
    @Prop({type: String, required: true, default: () => (new ObjectId()).toString()})
    _id!: string;
}
