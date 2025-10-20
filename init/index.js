const mongoose=require("mongoose");
const initdata=require('./data.js');
const Listing=require('../models/listing.js');
const Review=require('../models/review.js');
const MONGO_URL="mongodb://127.0.0.1:27017/wanderlust";
main().then(()=>{
    console.log("connected to DB");
}).catch((err)=>{
    console.log(err);
})
async function main()
{
    await mongoose.connect(MONGO_URL);
}

async function insertReviewManually() {
    try {
      const review = new Review({ rating: 4, comment: "Test review insert" });
      await review.save();
      console.log("✅ Review inserted manually!");
    } catch (err) {
      console.error("❌ Error inserting review:", err);
    }
  }

insertReviewManually();
const initDB= async()=>{
    await Listing.deleteMany({});
    initdata.data=initdata.data.map((obj)=>({
        ...obj,
        owner:'686403b9d9ecc1a097e7fd3b',
    }));
    await Listing.insertMany(initdata.data);
    console.log("data was initialized");
}

initDB();
