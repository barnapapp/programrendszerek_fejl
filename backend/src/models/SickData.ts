import mongoose, { Model, Schema } from "mongoose";

export interface ISickData extends Document {
    bloodPressure: number;
    pulse: number;
    weight: number;
    bloodSugar: number;
    age: number;
}

const SickDataSchema: Schema<ISickData> = new mongoose.Schema({
    bloodPressure: { type: Number, required: true},
    pulse: { type: Number, required: true},
    weight: { type: Number, required: true},
    bloodSugar: { type: Number, required: true},
    age: { type: Number, required: true}
});

export const SickData: Model<ISickData> = mongoose.model<ISickData>("SickData", SickDataSchema);