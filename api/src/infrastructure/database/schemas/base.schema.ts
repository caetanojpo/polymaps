import * as mongoose from 'mongoose';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';
import { pre, getModelForClass, Prop, Ref, modelOptions } from '@typegoose/typegoose';

import ObjectId = mongoose.Types.ObjectId;

export class BaseSchema extends TimeStamps {
    @Prop({ required: true, default: () => (new ObjectId()).toString() })
    _id: string | undefined;
}
