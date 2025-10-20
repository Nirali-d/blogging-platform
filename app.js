const express=require("express");
const app=express();
const mongoose=require("mongoose");
const Listing=require('./models/listing.js');
const path=require('path');
const methodOverride=require('method-override');
const ejsMate=require("ejs-mate");
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
const wrapAsync=require('./utils/wrapAsync.js');
const ExpressError=require('./utils/ExpressError.js');
const {listingSchema,reviewSchema}=require('./schema.js');//for validating listing joi is used here.
const Review=require('./models/review.js');
const ListingRouter=require('./routes/listing.js');
const UserRouter=require('./routes/user.js');
const ReviewRouter=require('./routes/review.js');
const session=require("express-session");
const flash=require("connect-flash");
const passport=require("passport");
const LocalStatergy=require("passport-local");//This pacakge for simple username and password based authentication.
const User=require('./models/user.js');

//DATABASE CONNECTION
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main()
{
    await mongoose.connect(MONGO_URL);
}

//CONFIGURATION
app.set('view engine',"ejs");
app.set("views",path.join(__dirname,"views"));

//MIDDLEWARE
app.use(express.urlencoded({extended:true}));
app.use(methodOverride("_method"));
app.engine('ejs',ejsMate);
app.use(express.static(path.join(__dirname,"/public")));

const sessionOptions={
    secret:"mysupersecretcode",
    resave:false,
    saveUninitialized:true,
    cookie:{
        expires:Date.now()+7*24*60*60,
        maxAge:7*24*60*60,
        httpOnly:true//to avoid xss attacks

    }
}

//ROOT ROUTE
app.get('/',(req,res)=>{
    res.send("request is accepted");
})

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStatergy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.success=req.flash("success");
    res.locals.error=req.flash("error");
    res.locals.currUser=req.user;
    next();
})
//These are parent routes
app.use('/listings',ListingRouter);
app.use('/listings/:id/reviews',ReviewRouter);
app.use('/',UserRouter);

/*app.get('/demo',async(req,res)=>{
    let fakeUser=new User({
        email:"student@gmail.com",
        username:"student",
    })
    let newuser=await User.register(fakeUser,"hello");
    console.log(newuser);
})*/

//ERROR HANDLING MIDDLEWARE
app.use((err,req,res,next)=>{
    let {statusCode=500,message="Something went wrong"}=err;
    res.status(statusCode).render("./listings/error.ejs",{message});
});

//CREATING SERVER
app.listen(8080,()=>{
    console.log("server is running");
})


//to match any kind of routes that is if not routes in the top have matched this will be invoked.
/*app.all("*",(req,res,next)=>{
    next(new ExpressError(404,"page not  found"));
});*/