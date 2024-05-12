import { Router, Request, Response, NextFunction } from 'express';
import { PassportStatic } from 'passport';
import { User, IUser, PartialUser } from '../model/User';
import { ISickData } from '../model/SickData';
import { getSickData, uploadSickData } from '../db/databaseOperations';


const ensureAuthenticated = (req: Request, res: Response, next: NextFunction) => {

    if(req.isAuthenticated()) {
        
        return next();
    }

    res.status(401).send("Unauthorized. Please login.");
};


export const configureRoutes = (passport: PassportStatic, router: Router): Router => {

    router.use((req: Request, res: Response, next: NextFunction) => {

        if(req.path == "/login" || req.path == "/register" || req.path == "/checkAuth") {

            return next();
        }

        return ensureAuthenticated(req, res, next);
    });


    router.post('/login', (req: Request, res: Response, next: NextFunction) => {
        passport.authenticate('local', (error: string | null, user: typeof User) => {
            if (error) {
                console.log(error);
                res.status(500).send(error);
            } else {
                if (!user) {
                    res.status(400).send('User not found.');
                } else {
                    req.login(user, (err: string | null) => {
                        if (err) {
                            console.log(err);
                            res.status(500).send('Internal server error.');
                        } else {

                            res.status(200).send(user);
                        }
                    });
                }
            }
        })(req, res, next);
    });


    router.post('/register', (req: Request, res: Response) => {
        
        const user = new User(req.body);
        console.log("ez a user: " + user);

        user.save().then(data => {
            res.status(200).send(data);
        }).catch(error => {

            console.log(error);
            res.status(500).send(error);
        })
    });


    router.post('/logout', (req: Request, res: Response) => {

        req.logout((error) => {
            if (error) {
                
                res.status(500).send('Internal server error.');
            }
            res.status(200).send('Successfully logged out.');
        });
    });


    router.get('/getAllUsers', (req: Request, res: Response) => {

        const role = req.query.role;
        const query = User.find({ role: role });
        query.then(data => {
            
            res.status(200).send(data);
        }).catch(error => {
            
            console.log(error);
            res.status(500).send('Internal server error.');
        })
    });


    router.get('/checkAuth', (req: Request, res: Response) => {

        if (req.isAuthenticated()) {
            res.status(200).send(true);            
        } else {
            res.status(500).send(false);
        }
    });


    router.get('/checkRole', (req: Request, res: Response) => {
        
        let user: IUser = req.user as IUser;
        let role: string = user.role;
        let name: string = user.name;
        
        res.status(200).send({"UserRole": role, "UserName": name});
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
            res.status(200).send({"ResponseText": "Data insert is successful"});
        } else {
            res.status(500).send({"ResponseText": "Data insert is unsuccessful"});
        }
    });

    return router;
}