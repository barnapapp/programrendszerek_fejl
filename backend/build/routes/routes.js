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
exports.configureRoutes = void 0;
const passport_1 = __importDefault(require("passport"));
const databaseOperations_1 = require("../db/databaseOperations");
const User_1 = require("../models/User");
const ensureAuthenticated = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    res.status(401).send("Unauthorized. Please login.");
};
const configureRoutes = (router) => {
    router.use((req, res, next) => {
        if (req.path == "/login" || req.path == "/register" || req.path == "/checkAuth") {
            return next();
        }
        return ensureAuthenticated(req, res, next);
    });
    router.get('/getsickdata', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let user;
        if (req.user) {
            user = req.user;
            if (user.role == "doctor") {
                let result = yield (0, databaseOperations_1.getSickData)();
                res.status(200).send(result);
            }
            else {
                res.status(500).send("Please login with an doctor account");
            }
        }
        else {
            res.status(500).send("User is not logged in");
        }
    }));
    router.post('/addmeasuredvalue', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
        let data = req.body;
        let result = yield (0, databaseOperations_1.uploadSickData)(data);
        if (result) {
            res.status(200).send("Sikeres adat beszuras");
        }
        else {
            res.status(500).send("Az adat beszuras sikertelen");
        }
    }));
    router.post('/register', (req, res) => {
        const data = req.body;
        const user = new User_1.User(data);
        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {
            res.status(500).send(error);
        });
    });
    router.post('/login', (req, res, next) => {
        passport_1.default.authenticate('local', (error, user) => {
            if (error) {
                res.status(500).send(error);
            }
            else {
                if (!user) {
                    res.status(400).send("User not found");
                }
                else {
                    req.login(user, (err) => {
                        if (err) {
                            res.status(500).send("Internal server error");
                        }
                        else {
                            console.log("ez az authentikacios allapot: " + req.isAuthenticated());
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });
    router.post('/logout', (req, res) => {
        if (req.isAuthenticated()) {
            req.logout((error) => {
                if (error) {
                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            });
        }
        else {
            res.status(500).send('User is not logged in.');
        }
    });
    router.get('/getAllUsers', (req, res) => {
        if (req.isAuthenticated()) {
            const query = User_1.User.find();
            query.then(data => {
                res.status(200).send(data);
            }).catch(error => {
                console.log(error);
                res.status(500).send("Internal server error.");
            });
        }
        else {
            res.status(500).send("User is not logged in");
        }
    });
    router.get('/checkAuth', (req, res) => {
        if (req.isAuthenticated()) {
            res.status(200).send(true);
        }
        else {
            res.status(500).send(false);
        }
    });
    return router;
};
exports.configureRoutes = configureRoutes;
