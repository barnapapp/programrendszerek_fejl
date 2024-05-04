import { Router, Request, Response, NextFunction } from "express";
import passport from "passport";
import { getSickData, uploadSickData } from "../db/databaseOperations";
import { ISickData } from "../models/SickData";
import { IUser, User } from "../models/User";

const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {

    if (req.isAuthenticated()) {
   
        return next();
    }
    res.status(401).send("Unauthorized. Please login.");
};


export const configureRoutes = (router: Router): Router => {

    router.use((req: Request, res: Response, next: NextFunction) => {

        if(req.path == "/login" || req.path == "/register" || req.path == "/checkAuth") {
         
            return next();
        }

        return ensureAuthenticated(req, res, next);
    });
    

    router.get('/getsickdata', async (req: Request, res: Response) => {
        
        let user: IUser;
        if(req.user) {

            user = req.user as IUser;
            if(user.role == "doctor") {

                let result: ISickData[] = await getSickData();
                res.status(200).send(result);
            } else {

                res.status(500).send("Please login with an doctor account");
            }
        } else {

            res.status(500).send("User is not logged in");
        }
      });


    router.post('/addmeasuredvalue', async (req: Request, res: Response) => {

        let data: ISickData = req.body;
        let result: boolean = await uploadSickData(data);

        if(result) {
            res.status(200).send("Sikeres adat beszuras");
        } else {
            res.status(500).send("Az adat beszuras sikertelen");
        }
    });


    router.post('/register', (req: Request, res: Response) => {

        const data: IUser = req.body;
        const user = new User(data);
        user.save().then(data => {
  
            res.status(200).send(data);
        }).catch(error => {
       
            res.status(500).send(error);
        });
    });


    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        
        passport.authenticate('local', (error: string | null, user: typeof User) => {

            if(error) {

                res.status(500).send(error);
            } else {
                if(!user) {
                    res.status(400).send("User not found");
                } else {
                    req.login(user, (err: string | null) => {
                        if(err) {

                            res.status(500).send("Internal server error");
                        } else {
                            console.log("ez az authentikacios allapot: " + req.isAuthenticated());
                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });


    router.post('/logout', (req: Request, res: Response) => {

        if (req.isAuthenticated()) {

            req.logout((error) => {
                if (error) {

                    res.status(500).send('Internal server error.');
                }
                res.status(200).send('Successfully logged out.');
            })
        } else {

            res.status(500).send('User is not logged in.');
        }
    });

    
    router.get('/getAllUsers', (req: Request, res: Response) => {

        if(req.isAuthenticated()) {
            const query = User.find();
            query.then(data => {

                res.status(200).send(data);
            }).catch(error => {

                console.log(error);
                res.status(500).send("Internal server error.");
            })
        } else {

            res.status(500).send("User is not logged in");
        }
    });


    router.get('/checkAuth', (req: Request, res: Response) => {

        if(req.isAuthenticated()) {

            res.status(200).send(true);
        } else {
            res.status(500).send(false);
        }
    });

    return router;
}