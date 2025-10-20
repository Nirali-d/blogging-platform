const express=require("express");
const router=express.Router();
const Listing=require('../models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const wrapAsync=require('../utils/wrapAsync.js');
const Review=require('../models/review.js');
const passport=require("passport");
//Extract the property named isLoggedIn
const {isLoggedIn,validateListing}=require("../middleware.js");
const {isOwner}=require("../middleware.js");
const listingController=require("../controllers/listings.js");


//INDEX ROUTE
router.get('/',wrapAsync(listingController.index));
//NEW ROUTE
router.get('/new',isLoggedIn,listingController.renderNewForm);


//SHOW ROUTE
router.get('/:id',wrapAsync(listingController.showListing));

router.get('/:id/edit',isLoggedIn,isOwner,wrapAsync(listingController.renderEditForm)
);

//NEW LISTING
router.post('/',isLoggedIn,validateListing,
    wrapAsync(listingController.createListing)
);

/*app.get('/listings/:id/edit',wrapAsync(async(req,res)=>{
    let {id}=req.params;
    const listing=await Listing.findById(id);
    res.render('./listings/edit.ejs',{listing})
})
);*/

router.put('/:id',isLoggedIn,isOwner,validateListing,wrapAsync(
listingController.updateListing));

router.delete('/:id',isLoggedIn,isOwner,wrapAsync(listingController.destroyListing)
);

module.exports=router;