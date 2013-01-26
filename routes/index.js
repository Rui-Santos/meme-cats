var mainActions = require('../controllers/index');

module.exports.init = function(app, auth){

  app.get('/', auth.requiresLogin, mainActions.index);

}