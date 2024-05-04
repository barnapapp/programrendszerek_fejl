import mongoose, { Model, Schema } from "mongoose";
import bcrypt from 'bcrypt';

const SALT_FACTOR = 10;

export interface PartialUser {
    email: string;
    password: string;
    name: string;
    role: "doctor" | "patient",
}

export interface IUser extends Document {
    email: string;
    password: string;
    name: string;
    birthDate?: Date;
    birthLocation?: string;
    mobileNumber?: number;
    role: "doctor" | "patient",
    comparePassword: (candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void) => void;
}

const UserSchema: Schema<IUser> = new mongoose.Schema({
    email: { type: String, required: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    birthDate: { type: Date, required: false },
    birthLocation: { type: String, required: false },
    mobileNumber: { type: Number, required: false },
    role: { type: String, required: true}
});

UserSchema.pre<IUser>('save', function(next) {
    const user = this;

    bcrypt.genSalt(SALT_FACTOR, (error, salt) => {

        if(error) {
            return next(error);
        }

        bcrypt.hash(user.password, salt, (err, encrypted) => {

            if(err) {
                return next(err);
            }

            user.password = encrypted;
            next();
        });
    });
});


UserSchema.methods.comparePassword = function(candidatePassword: string, callback: (error: Error | null, isMatch: boolean) => void): void {
    const user = this;

    bcrypt.compare(candidatePassword, user.password, (error, isMatch) => {

        if(error) {
            callback(error, false);
        }
        callback(null, isMatch);
    });
}

export const User: Model<IUser> = mongoose.model<IUser>('User', UserSchema);