const mongoose = require('mongoose');
const passport = require('passport-local-mongoose');
const Product = require('../models/product');


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        require: true,
        unique: true
    },
    cart:[
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
        }
    ]
});

userSchema.plugin(passport);

const User = mongoose.model('User', userSchema);

module.exports = User;