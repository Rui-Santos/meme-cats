var mainActions = require('../controllers/index');

module.exports.init = function(app){

  app.get('/', mainActions.index);

};