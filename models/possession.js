var mongoose = require('mongoose'),
    Schema = mongoose.Schema,

    // define a possession
    possessionSchema = new Schema({
        name: String,
        photo: String,
        location: String,
        publicItem: Boolean,
        lendable: Boolean,
        lent: Boolean,
        owner: { 'type': Schema.Types.ObjectId, 'ref': 'User' },
        condition: String,
        price: String,
        category: String,
        dateCreated: {'type': Date, 'default': Date.now}
    });

    /**
    * static methods
    **/

    // get num recent public possessions
    possessionSchema.statics.getRecent = function (num, cb) {
        this.where('publicItem', true)
            .limit(num)
            .sort('-dateCreated')
            .exec(function (err, items) {
                if (err) {
                    return cb(err);
                }

                return cb(null, items);
        });
    }

    /**
    * virtuals
    **/

    // build link to details view
    possessionSchema.virtual('detailsLink').get(function () {

        if(this.publicItem){
            return '/possessions/'+this._id;
        }else{
            return '/users/' + this.owner + '/possessions/'+this._id;
        }

    });

    // compile schema into a model
    mongoose.model('Possession', possessionSchema);