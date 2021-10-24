const passport = require('passport');
const cookieSession = require('cookie-session')
const userModel = require('../../models/user.model');
const jwt=require('../../utilities/jwtToken')
require('../../utilities/socialAuthentication/passport-setup')

module.exports = (app) => {
    const isLoggedIn = (req, res, next) => {
        if (req.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    app.use(cookieSession({
        name: 'fundoo-session',
        keys: ['key1', 'key2']
    }))

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/good', isLoggedIn, async(req, res) => {
        const googleProfile = req.user;
        // const response = {};
        const googleInfo = {
            firstName: googleProfile.name.givenName,
            lastName: googleProfile.name.familyName,
            email: googleProfile.emails[0].value,
            password: null,
            googleId: googleProfile.id,
            googleLogin: true
        };
        console.log(req.user)
        const checkemail=await userModel.findOne({email:googleInfo.email})
        if(checkemail)
        {
            const token = jwt.getToken(checkemail);
            res.send(token)
        }
        res.send("User is not registered")
    })
    app.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }),
        function (req, res) {
            // Successful authentication, redirect home.
            res.redirect('/good');
        }
    );
}
