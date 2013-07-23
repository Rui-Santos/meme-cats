var memeActions = require('../controllers/meme'),
	viewHelpers = require('../middleware/viewHelpers');

module.exports.init = function(app){

    app.get('/meme', viewHelpers.getCrumb, memeActions.meme);
    app.get('/imageproxy/:imageUrl', memeActions.imageProxy);

};