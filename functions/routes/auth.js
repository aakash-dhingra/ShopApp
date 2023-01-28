const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const passport = require('passport');


router.get('/fakeUser',async(req,res)=>{
    const user = new User({email: "test1@gmail.com", username: "test-1"});
    const newUser = await User.register(user,'1234');
    res.send(newUser);
})

router.get('/register', async(req,res)=>{
    res.render('auth/signup');
})

router.post('/register',async(req,res)=>{
    const user = new User({email: req.body.email, username: req.body.username});
    const newUser = await User.register(user, req.body.password);
    req.flash('success', 'Registered Successfully');
    res.redirect('/login');
})

router.get('/login', async(req,res)=>{
    res.render('auth/login');
})

router.post('/login',
  passport.authenticate('local', {
        
        failureRedirect: '/login',
        failureFlash: true 
        }),
        (req,res)=>{
            req.flash('success',`Welcome Back!! ${req.user.username}`);
            res.redirect('/products');
        }
);

// Logout the user from the current session
router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success', 'Logged Out Successfully');
    res.redirect('/login');
})


module.exports =router;
