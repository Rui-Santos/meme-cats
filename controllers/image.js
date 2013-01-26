var s3 = require('../lib/image/s3'),
	path = require('path');

exports.putImage = function(req, res, next){
  var uId = req.user.id;
  s3.putImage(uId+'/test.png', path.join(__dirname, '../public/images/auth/facebook.png'), 'public-read' ,function(error, result){
	if(error){
		next(error);
	}
    res.send({'resp':result});
  });
};