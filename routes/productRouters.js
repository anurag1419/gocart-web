const express = require('express');
const router=  express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const Logged =require('../middleware');
router.get('/products',async(req, res) => {
    try{
    const products = await Product.find({});
    res.render('products/index.ejs',{products});
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.render('/error');
    }
});


router.get('/products/new',(req,res)=>{
    res.render('products/new');
});


// Show a Particular product

router.get('/products/:id',async(req,res)=>{
    try{
        const {id} = req.params;
        const foundProduct = await Product.findById(id).populate('reviews');
         res.render('products/show',{foundProduct});
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }
})

router.post('/products',async(req, res) => {
    try{
    const newProducts ={
        ...req.body
    }
    await Product.create(newProducts);
    req.flash('success','Product Created Successfully!!');
    res.redirect('/products')
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }

})

router.get('/products/:id/edit',Logged,async(req, res) => {
    try{
    const {id}=req.params;
    const editProduct = await Product.findById(id);
    res.render('products/edit',{editProduct});
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }
});

router.patch('/products/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    const updated=req.body;
    await Product.findByIdAndUpdate(id,updated);
    res.redirect(`/products/${id}`)
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }
});

router.delete('/products/:id',async(req,res)=>{
    try{
    const {id}=req.params;
    await Product.findByIdAndDelete(id);
    res.redirect(`/products`);
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }
});

// Reviews

router.post('/products/:id/review',Logged,async(req,res)=>{
    try{
    const {id} = req.params;
    const product = await Product.findById(id);
    const {rating,comment}=req.body;

    const review = new Review({rating, comment,user:req.user.username});
    product.reviews.push(review);

    await product.save();
    await review.save();
    req.flash('success','Successfully created your review!!');
    res.redirect(`/products/${id}`);
    }
    catch(err){
        req.flash('error', 'oops, something went wrong');
        res.redirect('/error');
    }
})

router.get('/error',(req, res) => {
    res.render('error')
})
module.exports = router;