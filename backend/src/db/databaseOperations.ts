import mongoose from 'mongoose';
import { ISickData, SickData } from '../model/SickData';
import { PartialUser, User } from '../model/User';

export const initialCollectionCheck = async (collectionExist: (mongoose.mongo.CollectionInfo | Pick<mongoose.mongo.CollectionInfo, "name" | "type">)[]): Promise<void> => {

    if(!(collectionExist).some(col => col.name === "users")) {

        const initData: PartialUser[] = [            
            { email: "drpappbarna@gmail.com", password: "test111", name: "Dr.Papp Barna", role: "doctor"  },
            { email: "drgipszjakab@gmail.com", password: "test222", name: "Dr.Gipsz Jakab", role: "doctor"  },
            { email: "drhouse@gmail.com", password: "test333", name: "Dr. House", role: "doctor"  }
        ];

        for(const userData of initData) {

            const doctorUser = new User(userData);
            await doctorUser.save();
            console.log(`User registered: ${userData.email}`);
        }
        //await User.insertMany(initData);
        console.log("Users collection is created");
    }
};


export const uploadSickData = async (sickData: object): Promise<boolean> => {
    
    try {

        const result: ISickData = await SickData.create(sickData);
        return true;
    } catch(err) {

        console.error("Az adat beszuras sikertelen: " + err);
        return false;
    }
};


export const getSickData = async (): Promise<ISickData[]> => {

    try {

        const data: ISickData[] = await SickData.find();
        return data;
    } catch(err) {

        console.error("Hiba az adatok lekerese soran: " + err);
        return [];
    }
};