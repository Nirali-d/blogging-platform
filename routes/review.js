const express=require("express");
const router=express.Router({mergeParams:true});
const path=require('path');
const Listing=require('../models/listing.js');
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const wrapAsync=require('../utils/wrapAsync.js');
const ExpressError=require('../utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('../schema.js');//for validating listing joi is used here.
const Review=require('../models/review.js');
const {validateReview,isLoggedIn}=require("../middleware.js");


router.post("/",validateReview,isLoggedIn,wrapAsync(async(req,res)=>{
    let listing=await Listing.findById(req.params.id);
    let newReview=new Review(req.body.review);
    newReview.author=req.user._id;
    await newReview.save();

    listing.reviews.push(newReview); // ✅ correct way
    await listing.save();
    req.flash("success","NEW REVIEW CREATED"); 
    res.redirect(`/listings/${listing._id}`);
}));

//DELETE REVIEW ROUTE
router.delete("/:reviewId",isLoggedIn,wrapAsync(async(req,res)=>{
    let {id,reviewId}=req.params;
    await Listing.findByIdAndUpdate(id,{$pull:{reviews:reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","REVIEW DELETED"); 
    res.redirect(`/listings/${id}`);

}))

module.exports=router;