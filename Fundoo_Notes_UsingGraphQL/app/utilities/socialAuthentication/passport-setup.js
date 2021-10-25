const passport = require('passport');
const userModel = require('../../models/user.model');
const jwt = require('../jwtToken');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
require('dotenv').config();

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(new GoogleStrategy({
  clientID: process.env.CLIENT_ID,
  clientSecret: process.env.CLIENT_SECRET,
  callbackURL: "https://localhost:3000/google/callback"
},
  async function (accessToken, refreshToken, profile, done) {
    return done(null, profile);
  }
));