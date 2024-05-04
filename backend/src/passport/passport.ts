import { PassportStatic } from 'passport';
import { Strategy } from 'passport-local';
import { User } from '../models/User';

export const configurePassport = (passport: PassportStatic): PassportStatic => {

    passport.serializeUser((user: Express.User, done) => {
        
        console.log("User is serialized.");
        done(null, user);
    });

    passport.deserializeUser((user: Express.User, done) => {

        console.log("User is deserialized.");
        done(null, user);
    });

    passport.use('local', new Strategy((username, password, done) => {

        const query = User.findOne({ email: username });
        query.then(user => {
            if (user) {
                user.comparePassword(password, (error, isMatch) => {
                    if(!isMatch) {
                        done('Incorrect username or password.');
                        return;
                    } 
                    
                    if (error) {
                        done(error);
                    } else {
                        done(null, user);
                    }
                });
            } else {
                done(null, undefined);
            }
        }).catch(error => {
            done(error);
        })
    }));

    return passport;
};