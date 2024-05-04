"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SickData = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const SickDataSchema = new mongoose_1.default.Schema({
    bloodPressure: { type: Number, required: true },
    pulse: { type: Number, required: true },
    weight: { type: Number, required: true },
    bloodSugar: { type: Number, required: true },
    age: { type: Number, required: true }
});
exports.SickData = mongoose_1.default.model("SickData", SickDataSchema);
