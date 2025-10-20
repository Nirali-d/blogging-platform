const express=require("express");
const app=express();
const session=require("express-session");
const flash=require("connect-flash");
const path=require("path");

app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));

const sessionOptions={
    secret:"mysupersecret",
    resave:false,
    saveUninitialized:true,
}

app.use(session(sessionOptions));
app.use(flash());

app.get('/register',(req,res)=>{
    let {name="anonymous"}=req.query;//setting default name
    req.session.name=name;
    req.flash("success","user registered");
    console.log(req.session.name);
    res.redirect('/hello');
});


app.get('/hello',(req,res)=>{
    res.render("page.ejs",{name:req.session.name,msg:req.flash("success")});
})


app.listen(8080,(req,res)=>{
    console.log("server listening on port 8080");
})