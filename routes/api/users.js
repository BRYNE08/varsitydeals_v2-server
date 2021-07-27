const express = require('express');
const router = express.Router();
const passport = require('passport');
const {cloudinary} = require('../../utilities/cloudinary');
const mongoose = require('mongoose');



// Load User model
const User = require('../../models/User');

// @route   GET api/users/test
// @desc    Tests users route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Users Works' }));


router.get('/addToCart/:id', (req, res) => {

  User.findOne({ _id: req.params.id }, (err, userInfo) => {
      let duplicate = false;

      console.log(userInfo)

      userInfo.cart.forEach((item) => {
          if (item.id == req.query.productId) {
              duplicate = true;
          }
      })


      if (duplicate) {
          User.findOneAndUpdate(
              { _id: req.params.id, "cart.id": req.query.productId },
              { $inc: { "cart.$.quantity": 1 } },
              { new: true },
              (err, userInfo) => {
                  if (err) return res.json({ success: false, err });
                  res.status(200).json(userInfo.cart)
              }
          )
      } else {
          User.findOneAndUpdate(
              { _id: req.params.id },
              {
                  $push: {
                      cart: {
                          id: req.query.productId,
                          quantity: 1,
                          date: Date.now()
                      }
                  }
              },
              { new: true },
              (err, userInfo) => {
                  if (err) return res.json({ success: false, err });
                  res.status(200).json(userInfo.cart)
              }
          )
      }
  })
});


router.get('/removeFromCart', (req, res) => {

  User.findOneAndUpdate(
      { _id: req.user._id },
      {
          "$pull":
              { "cart": { "id": req.query._id } }
      },
      { new: true },
      (err, userInfo) => {
          let cart = userInfo.cart;
          let array = cart.map(item => {
              return item.id
          })

          Product.find({ '_id': { $in: array } })
              .populate('writer')
              .exec((err, cartDetail) => {
                  return res.status(200).json({
                      cartDetail,
                      cart
                  })
              })
      }
  )
})


router.get('/userCartInfo/:id', (req, res) => {
  User.findOne(
      { _id: req.params.id },
      (err, userInfo) => {
          let cart = userInfo.cart;
          let array = cart.map(item => {
              return item.id
          })


          Product.find({ '_id': { $in: array } })
              .populate('user')
              .exec((err, cartDetail) => {
                  if (err) return res.status(400).send(err);
                  return res.status(200).json({ success: true, cartDetail, cart })
              })

      }
  )
})



// @route   GET api/users/login
// @desc    Login User / Returning JWT Token
// @access  Public
router.get('/:id', (req, res) => {

  const id = req.params.id;

  // Find user by email
  User.findOne({ _id:id }).then(user => {
    // Check for user
    if (!user) {
      return res.status(404).json({error:'User not found'});
    }
    return res.json(user)
  })
  })

  router.post('/:id',(req, res) => {


      // Get fields
      const userFields = {};
      userFields._id =  req.params.id;
      if (req.body.fullname) userFields.fullname = req.body.fullname;
      if (req.body.email) userFields.email = req.body.email;
      if (req.body.institution) userFields.institution = req.body.institution;
      if (req.body.location) userFields.location = req.body.location;
      if (req.body.bio) userFields.bio = req.body.bio;
      if (req.body.phone) userFields.phone = req.body.phone;

      console.log(userFields)

      User.findOneAndUpdate({_id: req.params.id}, {$set:userFields}, {new: true, upsert:true}, (err, doc) => {
        if(err === null){
          console.log(err)
        }
        console.log(doc)
      })
        // if (user) {
        //   // Update
        //   User.findOneAndUpdate(
        //     { _id: req.params.id },
        //     { $set: userFields },
        //     { new: true }
        //   ).then(user => {
  
        //       res.json(user)
        //       }
        //     )
        //   }else {
        //     // Save User
            // userFields._id =  req.params.id;
        //     new User(userFields).save().then(user => res.json(user));
        // }
      });
  //   }
  // );  

router.post('/avatar',
  passport.authenticate('jwt', { session: false }),
  async (req, res) => {
    var images = [];
    var imageUrl;
    avatar = req.body.avatar;
        try {
            const fileStr = avatar;
            const uploadResponse = await cloudinary.uploader.upload(fileStr, {
                upload_preset: 'item-preset',
            });
            imageUrl = uploadResponse.url
            console.log(imageUrl)
            User.findOneAndUpdate(
              {_id: req.user.id},
              {$set:{avatar:imageUrl}},
              {new:true})
              .then(ress => res.json(ress))
              // .catch(() => res.status(500).send(err))
        }catch (err) {
  console.error(err);
  res.status(500).json({err});
}
})


// @route Get api/users/hasPrpofile
// @desc Return a boolean on whether the user has a profile or not
// @access Private

router.get(
  '/hasProfile',
  passport.authenticate('jwt', { session: false }),
  (req,res) => {
    User.findById(req.user.id)
    .then(user => {
      user.hasProfile === true? res.json({hasProfile:true}): res.json({hasProfile:false})
    })
  } )



module.exports = router;
