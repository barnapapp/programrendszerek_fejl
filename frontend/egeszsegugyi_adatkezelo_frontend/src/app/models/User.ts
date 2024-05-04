export interface User {
    email: string;
    password: string;
    name: string;
    birthDate?: Date;
    birthLocation?: string;
    mobileNumber?: number;
}