
/*
 * GET home page.
 */

exports.index = function(req, res){
	res.render('index', {
		title: 'Wheres my stuff',
		message: req.flash('error')
	});
};