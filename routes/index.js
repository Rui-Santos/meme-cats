
/*
 * GET home page.
 */

exports.index = function(req, res){
	var name = req.user ? req.user.name : 'please login';
	res.render('index', { title: 'Express', name: name });
};