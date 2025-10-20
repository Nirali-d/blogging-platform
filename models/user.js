const { required } = require("joi");
const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const passportLocalMongoose=require("passport-local-mongoose");



const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
    //passportlocalmongoose automatically creates username and password 
    //for us so we dont have to define explicitly
})


userSchema.plugin(passportLocalMongoose);

module.exports=mongoose.model("User",userSchema);