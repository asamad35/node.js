const passport = require("passport");
const User = require("../models/userModel");

const GoogleStrategy = require("passport-google-oauth20").Strategy;

passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  User.findById(id, function (err, user) {
    done(err, user);
  });
});

passport.use(
  new GoogleStrategy(
    {
      clientID:
        "2874966028-c7t5nfaioug5esi48tjkl4buirchhs6n.apps.googleusercontent.com",
      clientSecret: "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",
      callbackURL: "http://localhost:4000/auth/google/callback",
    },
    (accessToken, refreshToken, profile, next) => {
      // callback
      console.log("MY PROFILE: ", profile);
      User.findOne({ email: profile._json.email }).then((user) => {
        if (user) {
          console.log("user already exist in db", user);
          next(null, user);
        } else {
          User.create({
            name: profile.displayName,
            email: profile._json.email,
            googleId: profile.id,
          })
            .then((user) => {
              console.log("new user", user);
              next(null, user);
            })
            .catch((err) => console.log(err));
        }
      });
      // next();
    }
  )
);
