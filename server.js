const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require("cors");
const users = require('./routes/api/users');
const profile = require('./routes/api/profile');
const items = require('./routes/api/items');
const messages = require('./routes/api/messages');
const cart = require('./routes/api/cart');
const address = require('./routes/api/address')
const app = express();

const port = process.env.PORT || 3001;

const server = app.listen(port, () =>
  console.log(`Server running on port ${port}`)
);

const io = require("socket.io").listen(server);

// Body parser middleware
app.use(bodyParser.urlencoded({limit:'50mb',extended:true,parameterLimit:50000}));
app.use(bodyParser.json({limit:'50mb'}));

// http://www.varsitydeals.co.za
// https://naughty-swirles-a8944b.netlify.app
// CORS middleware
app.use(cors({origin:'http://localhost:3000'}))

// DB config
const db = require('./config/keys').MongoURI;


// Connect to MongoDB
// mongodb://localhost/varsity
// mongodb+srv://Bryne:3Boyz2Bil@varsitydeals.gkgeo.mongodb.net/<Varsitydeals>?retryWrites=true&w=majority
// mongodb://localhost/varsity
mongoose
    .connect('mongodb://localhost/varsity')
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

//Passport middleware 
app.use(passport.initialize());
// Passport Config
require('./config/passport')(passport);

// Assign socket object to every request
app.use(function (req, res, next) {
  req.io = io;
  next();
});


app.use('/api/users', users);
app.use('/api/profile',profile);
app.use('/api/items',items);
app.use('/api/messages', messages);
app.use('/api/cart', cart);
app.use('/api/address',address);