var mongoose = require('mongoose'),
    Possession = mongoose.model('Possession'),
    User = mongoose.model('User');

exports.signin = function () {};

// auth callback
exports.authCallback = function (req, res) {
  res.redirect('/');
};

// login
exports.login = function (req, res) {
  res.render('users/login', {
      title: 'Login',
      message: req.flash('error')
  });
};

// sign up
exports.signup = function (req, res) {
  res.render('users/signup', {
      title: 'Sign up',
      user: new User()
  });
};

// logout
exports.logout = function (req, res) {
  req.logout();
  res.redirect('/login');
};

// session
exports.session = function (req, res) {
  res.redirect('/');
};

// signup
exports.create = function (req, res, next) {
  var user = new User(req.body);
  user.provider = 'local';
  user.save(function (err) {
    if (err) {
      // duplicate username
      if(err.code === 11000){
        err.errors = { user_exists:{ type: 'Username already exists' }};
      }
      return res.render('users/signup', { errors: err.errors, user: user, title: 'signup' });
    }
    req.logIn(user, function(err) {
      if (err) return next(err);
      return res.redirect('/');
    });
  });
};

// show profile
exports.show = function (req, res, next) {
  var user = req.profile,
      possLink = req.path + '/possessions';

    res.format({
        html: function(){
            return  res.render('users/show', {
                        title: user.name,
                        user: user,
                        possessions: possLink
                    });
        },

        json: function(){
            var rsp = {
                user: user,
                possessions: possLink
            }
            return res.json(rsp);
        }
    });
};