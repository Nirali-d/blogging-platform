const mongoose=require("mongoose");
const Schema=mongoose.Schema;
const Review=require("./review.js");


const listingSchema=new Schema({
    title:{
        type:String,
    },
    description:String,
    image:{
        filename:String,
        url:{
            type:String,
            default:"https://unsplash.com/photos/lemon-water-in-footed-glass-RgplfXbxLFs", 
            set:(v)=>
                v===""
                ?"https://unsplash.com/photos/lemon-water-in-footed-glass-RgplfXbxLFs"
                :v,
        }
    },
    price:Number,
    location:String,
    country:String,
    reviews:[
        {
         type:Schema.Types.ObjectId,
         ref:"Review",
        }
    ],
    owner:{
        type:Schema.Types.ObjectId,
        ref:"User",
    }
});
//To make sure that all reviews get deleted when the listing gets deletd we define a middleware.

listingSchema.post("findOneAndDelete",async (listing) =>{
    if(listing){
        await Review.deleteMany({_id: {$in:listing.reviews}});
    }
})


const Listing=mongoose.model("Listing",listingSchema);
module.exports=Listing;