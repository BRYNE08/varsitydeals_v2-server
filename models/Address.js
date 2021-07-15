const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const AddressSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  residential:Boolean,
  recipient: String,
  phone: String,
  street: String,
  type: String,
  surbub: String,
  city: String,
  province: String,
  postalCode: Number
});

module.exports = mongoose.model('address', AddressSchema);