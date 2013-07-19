var memeActions = require('../controllers/meme');

module.exports.init = function(app){

    app.get('/meme', memeActions.meme);
    app.get('/imageproxy/:imageUrl', memeActions.imageProxy);

};