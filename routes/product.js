const express = require('express');
var router = express.Router();
const Product = require('../models/product');
const Review = require('../models/review');
const { isLoggedIn } = require('../middleware');


router.get('/products',async (req,res)=>{
    const products = await Product.find({});
    res.render('products/index',{products});
})

router.get('/products/:id', async(req,res)=>{
    try{
        const product = await Product.findById(req.params.id).populate('review');
        res.render('products/show',{product});
    }
    catch(e){
        req.flash('error','Product Not Found');
        res.redirect('/error');
    }
})


router.get('/product/add',isLoggedIn, (req,res)=>{
    
    res.render('products/add');
})

router.post('/products', isLoggedIn, async(req,res)=>{
    try{
        const product =  await req.body.product;
        await Product.create(product);
        req.flash('success','Product Created Successfully');
        res.redirect('/products')
    }
    catch(e){
        req.flash('error','Product not Created');
        res.redirect('/error');
    }
})

router.get('/products/:id/edit',isLoggedIn, async(req,res)=>{
    const product = await Product.findById(req.params.id);
    res.render('products/edit',{product})
})


router.patch('/products/:id',isLoggedIn, async(req,res)=>{
    try{
        await Product.findByIdAndUpdate(req.params.id,req.body.product);
        req.flash('success','Product Updated Successfully');
        res.redirect(`/products/${req.params.id}`);
    }
    catch(e){
        req.flash('error','Product not Updated');
        res.redirect('/error');
    }
})

router.delete('/products/:id',isLoggedIn, async (req, res) => {
    try{

        await Product.findByIdAndDelete(req.params.id);
        req.flash('success','Product Deleted Successfully');
        res.redirect('/products');
    }
    catch(e){
        console.log(e.message);
        req.flash('error','Product Cant be Deleted');
        res.redirect('/error');
    }
})


router.get('/error',(req,res)=>{
    res.status(404).render('error');
})
//Reviews-------------------

router.post('/products/:id/rate',isLoggedIn, async(req,res)=>{
    try{

        const product = await Product.findById(req.params.id);
        console.log(req.body);
    
        const review = new Review({
            user: req.user.username,
            ...req.body
        });
        product.review.push(review);
        
        await review.save();
        await product.save();
        
        req.flash('success', 'Suucessfully Added Your Review ');
        res.redirect(`/products/${req.params.id}`);
    }
    catch(e){
        console.log(e.message);
        req.flash('error', 'Cannot add review to this Product');
        res.redirect('/error');
    }
})






module.exports = router;