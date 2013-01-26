var imageActions = require('../controllers/image'),
    auth = require('../middleware/auth/authorization');

module.exports.init = function(app){

  app.get('/image', auth.requiresLogin, imageActions.putImage);

};