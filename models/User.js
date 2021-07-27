const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//Create Schema
const UserSchema = new Schema ({
    _id:{
        type: String,
        required: true
    },
    fullname: {
        type: String,
        require: true
    },
    avatar:{
        type:String,
        default: null
    },
    email: {
        type: String,
        require: true
    },
    
    institution: {
        type: String,
        require: true
    },
    bio:{
        type: String
    },
    location:{
        type: String,
        require: true
    },
    phone: {
        type: String,
        require: true
    },
    cart: {
        type: Array,
        default: []
    },
    date: {
        type: Date,
        default: Date.now
    }
});

module.exports = User = mongoose.model('users',UserSchema)
 