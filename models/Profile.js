const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create Schema
const ProfileSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  },
  gender:{
      type: String,
      require: true
  },
  student:{
    type: String,
    require: true
  },
  institution:{
    type: String,
    require: true
  },
  campus:{
      type: String,
  },
  location:{
      type: String,
      require:true
  }

});

module.exports = Profile = mongoose.model('profile', ProfileSchema);
