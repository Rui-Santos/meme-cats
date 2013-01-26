var imageActions = require('../controllers/image');

module.exports.init = function(app, auth){

  app.get('/image', auth.requiresLogin, imageActions.putImage);

};