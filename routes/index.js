var mainActions = require('../controllers/index'),
	viewHelpers = require('../middleware/viewHelpers');

module.exports.init = function(app){

  app.get('/', viewHelpers.getCrumb, mainActions.index);

};