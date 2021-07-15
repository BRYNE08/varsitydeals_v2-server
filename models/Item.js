var mongoose = require("mongoose");
const Schema = mongoose.Schema;

itemSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        ref: 'users'
      },
      profile:{
          type: Schema.Types.ObjectId,
          ref: 'profiles'
      },
    name: {
        type: String,
        require: true
    }, 
    description:  {
        type: String,
        require: true
    }, 
    category:  {
        type: String,
        require: true
    }, 
    price:  {
        type: String,
        require: true
    }, 
    images: [{
        type: String
    }], 
    date:{
        type: Date,
        default: Date.now
    }     
});

module.exports = Item = mongoose.model("items", itemSchema);
