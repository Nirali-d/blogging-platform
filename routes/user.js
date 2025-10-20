const express=require("express");
const router=express.Router();
const User=require('../models/user.js');
const passport=require("passport");
const {saveRedirectUrl}=require('../middleware.js');


router.get('/signup',(req,res)=>{
    res.render("users/signup.ejs");
})

router.post('/signup',async(req,res)=>{
    try{
    let {username,email,password}=req.body;
    let newUser=new User({email,username});
    const registeredUser=await User.register(newUser,password);
    console.log(registeredUser);
    req.login(registeredUser,(err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","welcome to wanderlust");
        res.redirect('/listings');
    })
    }
    catch(e)
    {
        req.flash("error","e.message");
        res.redirect('/signup');
    }
});


router.get('/login',(req,res)=>{
     res.render("users/login.ejs");
})

//AS THE USER AUTHENTICATES THE SESSION IS AUTOMATICALLY RESET BY PASSPORT
//user logins first path is saved and then authenticated
router.post('/login',
    saveRedirectUrl,
    passport.authenticate("local",
        {failureRedirect:'/login',
            failureFlash:true,
        }),
        async(req,res)=>{
            req.flash("success","welcome back to wanderlust");
            let redirectUrl=res.locals.redirectUrl || '/listings'; 
            res.redirect(redirectUrl);
});


router.get('/logout',(req,res)=>{
    req.logout((err)=>{
        if(err)
        {
            next(err);
        }
        req.flash("success","you are logged out!");
        res.redirect('/listings');
    })
})




module.exports=router;