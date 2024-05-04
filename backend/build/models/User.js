"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const SALT_FACTOR = 10;
const UserSchema = new mongoose_1.default.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthDate: { type: Date, required: false },
    birthLocation: { type: String, required: false },
    mobileNumber: { type: Number, required: false },
    role: { type: String, required: true }
});
UserSchema.pre('save', function (next) {
    const user = this;
    bcrypt_1.default.genSalt(SALT_FACTOR, (error, salt) => {
        if (error) {
            return next(error);
        }
        bcrypt_1.default.hash(user.password, salt, (err, encrypted) => {
            if (err) {
                return next(err);
            }
            user.password = encrypted;
            next();
        });
    });
});
UserSchema.methods.comparePassword = function (candidatePassword, callback) {
    const user = this;
    bcrypt_1.default.compare(candidatePassword, user.password, (error, isMatch) => {
        if (error) {
            callback(error, false);
        }
        callback(null, isMatch);
    });
};
exports.User = mongoose_1.default.model('User', UserSchema);