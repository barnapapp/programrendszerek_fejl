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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes/routes");
const mongoose_1 = __importDefault(require("mongoose"));
const databaseOperations_1 = require("./db/databaseOperations");
const passport_1 = __importDefault(require("passport"));
const passport_2 = require("./passport/passport");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const express_session_1 = __importDefault(require("express-session"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
const dbUrl = 'mongodb://localhost:27017/my_db';
const port = "3000";
mongoose_1.default.connect(dbUrl)
    .then(() => {
    console.log("Successfully connected to MongoDB.");
}).catch((err) => {
    console.log(err);
    return;
});
const db = mongoose_1.default.connection;
db.on('error', console.error.bind(console, "Mongo kapcsolodasi hiba"));
db.once('open', () => __awaiter(void 0, void 0, void 0, function* () {
    const collectionExist = yield mongoose_1.default.connection.db.listCollections().toArray();
    yield (0, databaseOperations_1.initialCollectionCheck)(collectionExist);
}));
const whiteList = ['*', 'http://localhost:4200'];
const corsOptions = {
    origin: (origin, callback) => {
        if (whiteList.indexOf(origin) !== -1 || whiteList.includes('*')) {
            callback(null, true);
        }
        else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
const sessionOptions = {
    secret: "testsecret",
    resave: false,
    saveUninitialized: false
};
app.use((0, express_session_1.default)(sessionOptions));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
(0, passport_2.configurePassport)(passport_1.default);
app.use(express_1.default.json());
app.use('/app', (0, routes_1.configureRoutes)(express_1.default.Router()));
app.listen(port, () => {
    console.log("Server is listening on port " + port.toString());
});
