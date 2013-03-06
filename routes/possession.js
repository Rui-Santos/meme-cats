var possessionActions = require('../controllers/possession'),
	auth = require('../middleware/auth/authorization');

module.exports.init = function(app){

	app.get('/possessions/:id?', possessionActions.publicPossessions);
	app.get('/possessions/add/form', auth.requiresLogin, possessionActions.addPossession);
	app.post('/possessions', auth.requiresLogin, possessionActions.createPossession);
	app.del('/possessions/:id', auth.requiresLogin, possessionActions.deletePossession);

};