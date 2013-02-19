var mongoose = require('mongoose'),
    Possession = mongoose.model('Possession'),
    findPossessions = Possession.find();

// most recent public possesions
exports.publicPossessions = function (req, res, next) {

    // display 10 most recent possessions
    findPossessions.where('publicItem', true)
        .limit(10)
        .sort('-dateCreated')
        .exec(function (err, items) {
        if (err) {
          return next(err);
        }

        return res.render('possessions/list', {
            title: 'possessions',
            possessions: items
        });
    });
};

// create a possession
exports.createPossession = function (req, res, next) {

    var possession = new Possession({
        name: 'test item',
        photo: 'http://www.blah.com',
        location: '',
        publicItem: true,
        lendable: false,
        lent: false,
        owner: req.user._id,
        condition: 'fair',
        price: '10.00',
        category: '',
        dateCreated: Date.now()
    });
    possession.save(function (err, possession) {
        if (err) {
          return next(err);
        }

        res.format({
            html: function(){
                return res.render('possessions/list', {
                    title: 'possessions',
                    possessions: possession
                });
            },

            json: function(){
                return res.json(possession);
            }
        })
    });
};

// delete a possession
exports.deletePossession  = function (req, res, next) {

    var id = req.param('id');

    if(id){
        Possession.findByIdAndRemove(id, function(err){
            if (err) return next(err);

            res.send(200);
        });
    } else {
        res.send(404);
    }
};