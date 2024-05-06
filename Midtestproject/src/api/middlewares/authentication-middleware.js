const passport = require('passport');
const passportJWT = require('passport-jwt');
const config = require('../../core/config');
const { User } = require('../../models');

// Define JWT strategy
passport.use(
  'user',
  new passportJWT.Strategy(
    {
      // // Extract the JWT token from the authorization header with the 'jwt' scheme
      // jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      // Extract the JWT token from the authorization header with the 'barier' scheme
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderAsBearerToken(),
      // Use the secret key from your configuration for verifying the token
      secretOrKey: config.secret.jwt,
    },
    // Asynchronous function for verifying the payload and authenticating the user
    async (payload, done) => {
      try {
        // Look up the user by the user_id from the token payload
        const user = await User.findById(payload.userId);

        if (user) {
          // If user is found, pass the user object to Passport
          return done(null, user);
        } else {
          // If user is not found, authentication fails
          return done(null, false);
        }
      } catch (error) {
        // Handle any errors during the lookup
        console.error('Error during authentication:', error);
        return done(error, false);
      }
    }
  )
);

// Export the middleware
module.exports = passport.authenticate('user', { session: false });
