var mongoose    = require("mongoose");

//SCHEMA Setup
var campgroundSchema = new mongoose.Schema({
   name: String,
   image: String,
   description: String,
   author: {
      id:{
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      username: String,
      fullname: String
   },
   comments: [
       {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment"
       }
     ]
});

var Campground = mongoose.model("Campground", campgroundSchema);
module.exports= Campground;