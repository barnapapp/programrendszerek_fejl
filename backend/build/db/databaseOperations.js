"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSickData = exports.uploadSickData = exports.initialCollectionCheck = void 0;
const SickData_1 = require("../models/SickData");
const User_1 = require("../models/User");
const initialCollectionCheck = (collectionExist) => __awaiter(void 0, void 0, void 0, function* () {
    if (!(collectionExist).some(col => col.name === "users")) {
        const initData = [
            { email: "drpappbarna@gmail.com", password: "test1", name: "Dr.Papp Barna", role: "doctor" },
            { email: "drgipszjakab@gmail.com", password: "test2", name: "Dr.Gipsz Jakab", role: "doctor" },
            { email: "drhouse@gmail.com", password: "test3", name: "Dr. House", role: "doctor" }
        ];
        for (const userData of initData) {
            const doctorUser = new User_1.User(userData);
            yield doctorUser.save();
            console.log(`User registered: ${userData.email}`);
        }
        //await User.insertMany(initData);
        console.log("Users collection is created");
    }
});
exports.initialCollectionCheck = initialCollectionCheck;
const uploadSickData = (sickData) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = yield SickData_1.SickData.create(sickData);
        console.log("Sikeres adat beszuras: " + result);
        return true;
    }
    catch (err) {
        console.error("Az adat beszuras sikertelen: " + err);
        return false;
    }
});
exports.uploadSickData = uploadSickData;
const getSickData = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield SickData_1.SickData.find();
        return data;
    }
    catch (err) {
        console.error("Hiba az adatok lekerese soran: " + err);
        return [];
    }
});
exports.getSickData = getSickData;
