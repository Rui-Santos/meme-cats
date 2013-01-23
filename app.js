
/**
 * Module dependencies.
 */

var express = require('express')
  , http = require('http')
  , path = require('path')
  , env = process.env.NODE_ENV || 'development'
  , config = require('./config/config')[env]
  , passport = require('passport')
  , auth = require('./lib/auth/authorization')
  , mongoose = require('mongoose')
  , userModel = require('./models/user')
  , passportConfig = require('./lib/auth/passport')
  , mongoStore = require('connect-mongo')(express)
  , users = require('./routes/user')
  , routes = require('./routes')
  , User = mongoose.model('User')
  , flash = require('connect-flash');

mongoose.connect(config.db);

// init passport configuration
passportConfig.init(passport, config);

var app = express();

app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.cookieParser());
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.methodOverride());

  // express/mongo session storage
  app.use(express.session({
    secret: 'noobjs'
    , cookie: { maxAge: 24 * 60 * 60 * 1000 }
    , store: new mongoStore({
        url: config.db
        , collection : 'sessions'
        , clear_interval: 3600
      })
  }));
  // connect flash for flash messages
  app.use(flash());

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express.static(path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.loginText = req.user ? 'logout' : 'login';
    next();

  });
  app.use(app.router);
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

app.get('/', routes.index);

// user actions
app.get('/login', users.login)
app.get('/signup', users.signup)
app.get('/logout', users.logout)
app.post('/users', users.create)
app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), users.session)
app.get('/users/:userId', users.show)
app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), users.signin)
app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), users.authCallback)
app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), users.signin)
app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), users.authCallback)
app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), users.signin)
app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), users.authCallback)

app.param('userId', function (req, res, next, id) {
  User
    .findOne({ _id : id })
    .exec(function (err, user) {
      if (err) return next(err)
      if (!user) return next(new Error('Failed to load User ' + id))
      req.profile = user
      next()
    })
})

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
