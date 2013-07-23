var mongoose = require('mongoose'),
	Possession = mongoose.model('Possession');

/*
 * GET home page.
 */
exports.index = function(req, res, next){

	if(req.user && req.user.id){
		Possession.getRecent(10, function(err, possessions){
			if(err){
				return next(err);
			}

			res.render('index', {
				title: 'Wheres my stuff',
				message: req.flash('error'),
				crumb: res.crumb,
				possessions: possessions
			});
		});
	} else {
		res.render('intro', {
			title: 'Wheres my stuff',
			crumb: res.crumb,
			message: req.flash('error')
		});
	}
};