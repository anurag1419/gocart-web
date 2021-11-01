const express = require('express');
const router=express.Router();
const User = require('../models/user');
const passport = require('passport');
// router.get('/fakeuser',async(req,res)=>{
//     const user = new User({
//         username: 'Anurag',
//         email: 'anurag@gmail.com'
//     });
//     const newUser = await User.register(user,'anurag12')

// })

router.get('/register',(req,res)=>{
    res.render('auth/signup');
})


router.post('/register',async(req,res)=>{
    try {
    const {username, email, password} = req.body;
    const user = new User({
        username:username,
        email:email,
    })
    await User.register(user,password);
    req.flash('success',`Welcome ${username},Please Login to continue!`);
    res.redirect('/products');
    }
    catch(err) {
         req.flash('error',err.message+" Try another!");
        res.redirect('/register');
    }
})

router.get('/login',(req,res)=>{
    res.render('auth/login');
});

router.post('/login',passport.authenticate('local',
    {
    failureRedirect:'/login',
    failureFlash: true
    }),(req,res)=>{
        console.log(req.body);
       req.flash('success',`Hey ${req.body.username} Welcome Back Again!!`);
        res.redirect('/products');
    });

    router.get('/logout',(req,res)=>{
        req.logout();
        req.flash('success',`Logged out Successfully!!`)
        res.redirect('/login');
    })
module.exports = router;