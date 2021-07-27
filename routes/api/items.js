const express = require('express');
const mongoose = require("mongoose");
const router = express.Router()
const Item = require('../../models/Item');


// const uploadController = require("../../controllers/upload");
// Load Profile Model
const Profile = require('../../models/Profile');
// Get all itemssws

// router.get('/',(req,res) => {
//     Item.find({}, (err,items) => {
//         if(err){
//             res.status(404).json({noItemsFound: 'No items found'})
//         }else{
//             var profileItems = [];
//             var count = 0;
//             items.forEach(function(item){
//                 Profile.find({user:item.user},(err,profile)=>{
//                     if(err){
//                         return res.json({noItemsFound: 'No profile found'})
//                     }else{
//                         var profileItem = {
//                             item: item,
//                             profile:profile
//                         }
//                         profileItems.push(profileItem);
//                         count++;
//                         if(count === items.length)
//                             res.json(profileItems)
//                     }
//                 })++
//             })

//         }
//     })
// });


router.post("/getProducts", (req, res) => {

    let order = req.body.order ? req.body.order : "desc";
    let sortBy = req.body.sortBy ? req.body.sortBy : "_id";
    let limit = req.body.limit ? parseInt(req.body.limit) : 100;
    let skip = parseInt(req.body.skip);
    let category = req.body.category? req.body.category : '';

    console.log(category)
        let findArgs = {};

    if(category)
        findArgs = {
            category: category
        }

    let term = req.body.searchTerm;

    for (let key in req.body.filters) {

        if (req.body.filters[key].length > 0) {
            if (key === "price") {
                findArgs[key] = {
                    $gte: req.body.filters[key][0],
                    $lte: req.body.filters[key][1]
                }
            } else {
                findArgs[key] = req.body.filters[key];
            }
        }
    }

    console.log(findArgs)

    if (term) {
        Item.find(findArgs)
            .find({ $text: { $search: term } })
            .populate("user")
            .sort([[sortBy, order]])
            .skip(skip)
            // .limit(limit)
            .exec((err, items) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, items, postSize: items.length })
            })
    } else {
        Item.find(findArgs)
            .populate("user")
            .sort([[sortBy, order]])
            .skip(skip)
            .limit(limit)
            .exec((err, items) => {
                if (err) return res.status(400).json({ success: false, err })
                res.status(200).json({ success: true, items, postSize: items.length })
            })
    }

});

router.get('/user-items/:id', (req,res) => {
    userId = req.params.id;
    Item.find({user : userId}, (err, items) => {
        if(err)
            return res.status(400).json({success: false, err})
        else
            return res.status(200).json({success:true, items, postSize: items.length})
    })

})


// router.get('/search',(req,res) => {
//     Item.find({}, (err,items) => {
//         if(err){
//             res.status(404).json({noItemsFound: 'No items found'})
//         }else{
//             var Items = [];
//             var count = 0;
//             items.forEach(function(item){
//                 var itemm = {
//                     id: item._id,
//                     name: item.name
//                 }
//                 Items.push(itemm)
//                 count ++;
//                         if(count === items.length)
//                             res.json(Items)
                    
//                 })
//             }

//         })
// })


//@route items/view/:id
//@desc Get user's item
//@access public 
router.get('/getProduct/:id', (req,res) => {
    var id = mongoose.Types.ObjectId(req.params.id);
    Item.find({_id: id})
        .populate('user')
        .then(item => res.json(item))
        .catch(err => console.log(err))
});

//show item details
// router.get('/category/:id', (req, res) => {
//     Item.find({category:req.params.id}, (err,items) => {
//         if(err){
//             res.status(404).json({noItemsFound: 'No items found'})
//         }else{
//             var profileItems = [];
//             var count = 0;
//             items.forEach(function(item){
//                 Profile.find({user:item.user},(err,profile)=>{
//                     if(err){
//                         return res.json({noItemsFound: 'No profile found'})
//                     }else{
//                         var profileItem = {
//                             item: item,
//                             profile:profile
//                         }
//                         profileItems.push(profileItem);
//                         count++;
//                         if(count === items.length)
//                             res.json(profileItems)
//                     }
//                 })
//             })

//         }
//     })
//     })



//ITEM ROUTES
// NEW ITEM
router.post("/new", (req, res) => {
    // console.log(req.body)
            var newItem = new Item({
                user: req.body.id,
                name: req.body.name,
                description: req.body.description,
                category: req.body.category,
                price: req.body.price,
                images: req.body.pics
            })
            newItem.save()
            .then(items => res.json(items))
            .catch(err => res.json(err ));
        });



//show item details
// router.get('/:id', (req, res) => {
//     item.findById(req.params.id)
//         .populate('user')
//         .then(foundItem =>{
//             Profile.find({user:foundItem.user})
//                 .then(Profile =>{
//                     const data = {
//                         item: foundItem,
//                         profile: Profile
//                     }
//                     return res.json(data)
//                 })
//         })
//     })    
        

// //Edit item
// router.put('/:id', (req, res) => {
//     var newItem = {
//         name: req.body.name,
//         description: req.body.description,
//         category: req.body.category,
//         price: req.body.price
//     }
//     item.findByIdAndUpdate(req.params.id, newItem, (err, Item) =>{
//         if(err){
//             res.status(500).send(err)
//         }else{
//             res.status(201).send(Item);
//         }
//     })
// })

//delete item
// router.delete('/delete/:id',passport.authenticate('jwt', { session: false }),(req, res) =>{
//     Item.findByIdAndRemove(req.params.id, (err) =>{
//         if(err){
//             res.status(500).json(err);
//         }else{
//             res.json({data: 'Item has been deleted'});
//         }
//     })
// })

module.exports = router;