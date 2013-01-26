var mongoose = require('mongoose'),
    userActions = require('../controllers/user'),
    User = mongoose.model('User');


module.exports.init = function(app, passport){

  // user actions
  app.get('/login', userActions.login);
  app.get('/signup', userActions.signup);
  app.get('/logout', userActions.logout);
  app.post('/users', userActions.create);
  app.post('/users/session', passport.authenticate('local', {failureRedirect: '/login', failureFlash: 'Invalid email or password.'}), userActions.session);
  app.get('/users/:userId', userActions.show);
  app.get('/auth/facebook', passport.authenticate('facebook', { scope: [ 'email', 'user_about_me'], failureRedirect: '/login' }), userActions.signin);
  app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), userActions.authCallback);
  app.get('/auth/github', passport.authenticate('github', { failureRedirect: '/login' }), userActions.signin);
  app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), userActions.authCallback);
  app.get('/auth/twitter', passport.authenticate('twitter', { failureRedirect: '/login' }), userActions.signin);
  app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), userActions.authCallback);

  app.param('userId', function (req, res, next, id) {
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