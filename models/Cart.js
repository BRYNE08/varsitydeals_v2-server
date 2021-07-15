var mongoose = require('mongoose');

var cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    item:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'items'
        }  
})
module.exports = Cart = mongoose.model('cart', cartSchema);

