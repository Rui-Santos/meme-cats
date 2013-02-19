var possessionActions = require('../controllers/possession'),
	auth = require('../middleware/auth/authorization');

module.exports.init = function(app){

	app.get('/possessions', possessionActions.publicPossessions);
	app.post('/possessions', auth.requiresLogin ,possessionActions.createPossession);
	app.del('/possessions/:id', auth.requiresLogin ,possessionActions.deletePossession);

};