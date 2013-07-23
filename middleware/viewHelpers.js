// set active header status
exports.getCrumb = function (req, res, next) {
    var crumb = req.route.path.toLowerCase().match(/home|meme|images|about/);

    res.crumb = 'home';

    if(crumb) {
    	res.crumb = crumb[0];
    }

    next();
};