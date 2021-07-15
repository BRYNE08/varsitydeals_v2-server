var express = require('express');
var router = express.Router();
var Cart = require('../../models/Cart');
var user = require('../../models/User');
var Item = require('../../models/Item');
const passport = require('passport');

//Show user cart 
router.get('/',passport.authenticate('jwt', { session: false }), (req, res) =>{
   Cart.find({user: req.user.id})
   .populate('item')
   .populate('user')
   .then(items => res.json(items))
})

//add new item to the cart
router.post('/:id',passport.authenticate('jwt', { session: false }), (req, res) =>{
    //search for the user's cart
    var newCart = new Cart({
        user: req.user.id,
        item: req.params.id       
        })
    newCart.save()
    .then(cart => res.json(cart))
    .catch(err => res.json(err ));
})

//Delete item from cart
router.delete("/:id", (req, res) =>{
    Cart.findByIdAndRemove(req.params.id, (err) =>{
        if(err){
            res.status(500).json(err);
        }else{
            res.json({data: 'Item has been deleted'});
        }
    })    
})

module.exports = router;