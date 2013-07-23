var mongoose = require('mongoose'),
    userActions = require('../controllers/user'),
    possessionActions = require('../controllers/possession'),
    User = mongoose.model('User'),
    auth = require('../middleware/auth/authorization'),
    viewHelpers = require('../middleware/viewHelpers'),
    passport = require('passport');


module.exports.init = function(app){

  // user actions
  app.get('/login', userActions.login);
  app.get('/users/:userId/possessions/:id?', auth.requiresLogin, possessionActions.userPossessions);
  app.get('/signup', userActions.signup);
  app.get('/logout', userActions.logout);
  app.post('/users', userActions.create);
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), userActions.session);
  app.get('/users/:userId', [auth.requiresLogin, viewHelpers.getCrumb], userActions.show);
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), userActions.signin);
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), userActions.authCallback);
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), userActions.signin);
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), userActions.authCallback);

  app.param('userId', function (req, res, next, id) {

    // make sure this user is the currently logged-in user
    if(String(req.user.id) !== String(id)){
      return next(new Error('invalid user id'));
    }

    User
      .findOne({ _id : id })
      .exec(function (err, user) {
        if (err) return next(err);
        if (!user) return next(new Error('Failed to load User ' + id));
        req.profile = user;
        next();
      });
  });

};