var mongoose = require("mongoose");
const Schema = mongoose.Schema;

itemSchema = new Schema({
    user: {
        type: String,
        ref: 'users'
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
