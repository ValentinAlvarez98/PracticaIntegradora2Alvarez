import passport from 'passport';
import userModel from '../dao/models/users.js';
import GitHubStrategy from 'passport-github2';

const initPassport = () => {

      const cltId = "Iv1.24cd048e80dae814";
      const cltSecret = "a5268992d5eb8b27b95049287848d23f10a5ff02";
      const cltURL = "http://localhost:8080/api/sessions/githubcallback";

      passport.serializeUser((user, done) => {

            done(null, user._id);

      });

      passport.deserializeUser(async (id, done) => {
            try {

                  const user = await userModel.findById(id);

                  done(null, user);

            } catch (error) {

                  done(error);

            };

      });

      passport.use('github', new GitHubStrategy({
            clientID: cltId,
            clientSecret: cltSecret,
            callbackURL: cltURL,
      }, async (accessToken, refreshToken, profile, done) => {

            try {

                  const user = await userModel.findOne({
                        email: profile._json.email
                  });

                  if (user) {

                        return done(null, user);

                  } else {

                        console.log(profile._json)

                        const first_name = profile._json.name.split(' ')[0];
                        const last_name = profile._json.name.split(' ')[1];

                        const newUser = {
                              first_name: first_name ? first_name : 'a',
                              last_name: last_name ? last_name : 'a',
                              age: profile._json.age ? profile._json.age : 0,
                              email: profile._json.email ? profile._json.email : profile._json.login,
                              password: 'a',
                        };

                        let result = await userModel.create(newUser);

                        return done(null, result);

                  };

            } catch (error) {

                  return done(error);

            }

      }));

};

export default initPassport;