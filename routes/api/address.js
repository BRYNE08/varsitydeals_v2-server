const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const passport = require('passport');
const Address = require('../../models/Address');


router.get('/',passport.authenticate('jwt', { session: false }), (req, res) =>{

Address.find({user: req.user.id})
.populate('user')
.then(address => res.json(address))
}
);


//Post- add addess to the database

router.post('/',passport.authenticate('jwt', { session: false }), (req, res)=>{
    var newAddress = new Address({
        user: req.user.id,
        residential: false,
        phone: req.body.phone,
        street: req.body.street,
        type: req.body.type,
        surbub: req.body.surbub, 
        city: req.body.city,
        province: req.body.province,
        postalCode: req.body.postalCode
    });
    newAddress.save()
    .then(Address, res.send(newAddress))
    .catch(err, res.send(err));
});

module.exports = router;