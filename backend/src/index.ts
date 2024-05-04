import express, { NextFunction } from 'express';
import { configureRoutes } from './routes/routes';
import mongoose from 'mongoose';
import { initialCollectionCheck } from './db/databaseOperations';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import cors from 'cors';


const app = express();
const dbUrl = 'mongodb://localhost:27017/my_db';
const port = "3000";

mongoose.connect(dbUrl)
.then(() => {

    console.log("Successfully connected to MongoDB.");
}).catch((err) => {
    
    console.log(err);
    return;
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Mongo kapcsolodasi hiba"));
db.once('open', async () => {

    const collectionExist = await mongoose.connection.db.listCollections().toArray();
    await initialCollectionCheck(collectionExist);

});

const whiteList = ['*', 'http://localhost:4200'];
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if(whiteList.indexOf(origin!) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));
app.use(cookieParser());

const sessionOptions: expressSession.SessionOptions = {
    secret: "testsecret",
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use(express.json());
app.use('/app', configureRoutes(express.Router()));

app.listen(port, () => {
    console.log("Server is listening on port " + port.toString());
});