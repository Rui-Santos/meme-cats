var mongoose = require('mongoose'),
    Possession = mongoose.model('Possession'),
    s3 = require('../lib/image/s3'),
    fs = require('fs');


function validateImage(img){

    if(img){
        var size = img.size,
            type = img.type,
            maxSize = 1 * 1024 * 1024,
            validSize = size <= maxSize,
            validType = type.match(/jpg|jpeg|png/gi);

        if(!validSize || !validType){

            // delete tmp image
            fs.unlink(img.path);
            return new Error('image must be valid size and type');
        }

        return img;
    }

    return new Error('invalid image data');
}

function saveImage(img, userId, callback){

    var remotePath = userId+'/'+img.name;

    s3.putImage(userId+'/'+img.name, img.path, 'public-read' ,function(error){

        if(error){
            return callback(new Error(error));
        }

        // delete tmp image
        fs.unlink(img.path);
        return callback(null, 'http://s3.amazonaws.com/wms-assets/' + remotePath);
    });
}

function deleteImage(path, callback){

    s3.delImage(path, function(error){

        if(error){
            return callback(new Error(error));
        }

        return callback(null, 'success');
    });
}

// creator for possesion objects
function PossessionObject(req, imagePath){

    var userId = req.user.id;

    this.name = req.param('possession-name') || '';
    this.photo = imagePath;
    this.location = req.param('possession-location') || '';
    this.publicItem = Boolean(req.param('possession-public')) || false;
    this.lendable = Boolean(req.param('possession-lendable')) || false;
    this.lent = Boolean(req.param('possession-lent')) || false;
    this.owner = userId;
    this.condition = req.param('possession-condition') || '';
    this.price = req.param('possession-price') || '0';
    this.category = req.param('possession-category') || 'stuff';
}

// show public possessions
exports.publicPossessions = function (req, res, next) {

    var id = req.param('id'),
        query = Possession.where('publicItem', true);

    if(id){
        query.where('_id', id)
    }else{
        query.limit(10)
        .sort('-dateCreated')
    }

    // display 10 most recent possessions
    query.exec(function (err, items) {
        if (err) {
          return next(err);
        }
        res.format({
            html: function(){
                return res.render('possessions/list', {
                    title: 'possessions',
                    possessions: items,
                    resourcePath: req.path
                });
            },

            json: function(){
                var rsp = {
                    possessions: items,
                    resourcePath: req.path
                }
                return res.json(rsp);
            }
        });
    });
};

exports.userPossessions = function(req, res, next){

    var userId = req.user.id,
        id = req.param('id'),
        query = Possession.where('owner', userId);

    if(id){
        query.where('_id', id)
    }else{
        query.limit(10)
        .sort('-dateCreated')
    }

    // display 10 most recent possessions
    query.exec(function (err, items) {
        if (err) {
          return next(err);
        }

        res.format({
            html: function(){
                return res.render('possessions/list', {
                    title: 'possessions',
                    possessions: items,
                    resourcePath: req.path
                });
            },

            json: function(){
                var rsp = {
                    possessions: items,
                    resourcePath: req.path
                }
                return res.json(rsp);
            }
        });
    });
};

// create a possession
exports.createPossession = function (req, res, next) {

    var image = validateImage(req.files.img),
        pubImagePath = '',
        userId = req.user.id,
        possession;

    if(image instanceof Error){
        return next(image);
    }else{
        pubImagePath = 'images/tmp/'+image.path.substring(image.path.lastIndexOf('/')+1);
    }

    // instantiate a new possession
    possession = new Possession(new PossessionObject(req, pubImagePath));

    // save possession to DB
    possession.save(function (err, possession) {

        if (err) {
          return next(err);
        }

        // push the image to s3
        saveImage(image, userId, function(err, remotePath){

            if(err){
                return next(new Error(err));
            }

            // update the stored path after image has saved to s3
            Possession.update({ _id: possession._id }, { photo: remotePath }, function (err) {
              if (err) return next(err);
            });

        });

        // render a response
        res.format({
            html: function(){
                return res.render('possessions/list', {
                    title: 'possessions',
                    possessions: [possession],
                    resourcePath: req.path
                });
            },

            json: function(){
                var rsp = {
                    possessions: possession,
                    resourcePath: req.path
                }
                return res.json(rsp);
            }
        });
    });
};

// delete a possession
exports.deletePossession  = function (req, res, next) {

    var id = req.param('id');

    if(id){
        Possession.findByIdAndRemove(id, function(err, possession){
            if (err) return next(err);

            var imagePath = req.user.id + possession.photo.substring(possession.photo.lastIndexOf('/'));

            deleteImage(imagePath, function(err){
                if (err) return next(new Error(err));
            });

            res.send(204);
        });
    } else {
        res.send(404);
    }
};