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


      User.findOne({ user: req.params.id }).then(user => {
        if (user) {
          // Update
          Profile.findOneAndUpdate(
            { user: req.params.id },
            { $set: userFields },
            { new: true }
          ).then(user => {
  
              res.json(user)
              }
            )
          }else {
            // Save User
            new User(userFields).save().then(user => res.json(user));
        }
      });
    }
  );  

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
