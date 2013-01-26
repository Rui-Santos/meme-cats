
/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    passport = require('passport'),
    auth = require('./middleware/auth/authorization'),
    mongoose = require('mongoose'),
    passportConfig = require('./middleware/auth/passport'),
    mongoStore = require('connect-mongo')(express),
    userRoutes = require('./routes/user'),
    indexRoutes = require('./routes/index'),
    imageRoutes = require('./routes/image'),
    flash = require('connect-flash');

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
    secret: 'noobjs',
    cookie: { maxAge: 24 * 60 * 60 * 1000 },
    store: new mongoStore({
        url: config.db,
        collection : 'sessions',
        clear_interval: 3600
      })
  }));
  // connect flash for flash messages
  app.use(flash());

  // use passport session
  app.use(passport.initialize());
  app.use(passport.session());
  app.use(express['static'](path.join(__dirname, 'public')));
  app.use(function(req, res, next){
    res.locals.user = req.user;
    res.locals.loginText = req.user ? 'logout' : 'login';
    next();
  });
  
  app.use(app.router);

  // handle next(err) calls
  app.use(function(err, req, res, next) {
    console.error(err.stack);
    res.send(500, 'Something broke!');
    next();
  });  
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// init main routes
indexRoutes.init(app, auth);

// init image routes
imageRoutes.init(app, auth);

// init user routes
userRoutes.init(app, passport, auth);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});


