var mainActions = require('../controllers/index'),
    auth = require('../middleware/auth/authorization');

module.exports.init = function(app){

  app.get('/', auth.requiresLogin, mainActions.index);

}