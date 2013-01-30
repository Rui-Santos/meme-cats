/**
 * Module dependencies.
 */

var express = require('express'),
    http = require('http'),
    path = require('path'),
    fs = require('fs'),
    env = process.env.NODE_ENV || 'development',
    config = require('./config/config')[env],
    passport = require('passport'),
    mongoose = require('mongoose'),
    mongoStore = require('connect-mongo')(express),
    flash = require('connect-flash'),
    routesPath = __dirname + '/routes',
    modelsPath = __dirname + '/models',
    app = express();

// init db connection
mongoose.connect(config.db);

// load models
fs.readdirSync(modelsPath).forEach(function (file) {
  if(file.match(/.js$/)){
    require(modelsPath+'/'+file);
  }
});

// init passport configuration
require('./middleware/auth/passport')(passport, config);

// configure express
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
    next(err);
  });
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// load routes
fs.readdirSync(routesPath).forEach(function (file) {
  if(file.match(/.js$/)){
    require(routesPath+'/'+file).init(app);
  }
});

http.createServer(app).listen(app.get('port'), function(){
  console.log("Express server listening on port " + app.get('port'));
});
