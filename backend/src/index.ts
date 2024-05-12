import express from 'express';
import { Request, Response } from 'express';
import { configureRoutes } from './routes/routes';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import expressSession  from 'express-session';
import passport from 'passport';
import { configurePassport } from './passport/passport';
import mongoose from 'mongoose';
import cors from 'cors';
import { initialCollectionCheck } from './db/databaseOperations';

const app = express();
const dbUrl = 'mongodb://localhost:27017/my_db';
const port = "3000";

// mongodb connection
mongoose.connect(dbUrl).then((_) => {
    console.log('Successfully connected to MongoDB.');
}).catch(error => {
    console.log(error);
    return;
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, "Mongo connection error"));
db.once('open', async () => {

    const collectionExist = await mongoose.connection.db.listCollections().toArray();
    await initialCollectionCheck(collectionExist);
});


const whitelist = ['*', 'http://localhost:4200']
const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
        if (whitelist.indexOf(origin!) !== -1 || whitelist.includes('*')) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS.'));
        }
    },
    credentials: true
};

app.use(cors(corsOptions));

// bodyParser
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.json());

// cookieParser
app.use(cookieParser());

// session
const sessionOptions: expressSession.SessionOptions = {
    secret: 'testsecret',
    resave: false,
    saveUninitialized: false
};
app.use(expressSession(sessionOptions));

app.use(passport.initialize());
app.use(passport.session());

configurePassport(passport);

app.use('/app', configureRoutes(passport, express.Router()));

app.listen(port, () => {
    console.log('Server is listening on port ' + port.toString());
});


