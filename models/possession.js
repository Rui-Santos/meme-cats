// user schema

var mongoose = require('mongoose'),
  Schema = mongoose.Schema,

  // define an item
  PossessionSchema = new Schema({
    name: String,
    photo: String,
    location: String,
    publicItem: Boolean,
    lendable: Boolean,
    lent: Boolean,
    owner: { type: Schema.Types.ObjectId, ref: 'User' },
    condition: String,
    price: String,
    category: String,
    dateCreated: Date
  });

// methods
// UserSchema.method('authenticate', function(plainText) {
//   return this.encryptPassword(plainText) === this.hashed_password;
// });

// compile schema into a model
mongoose.model('Possession', PossessionSchema);