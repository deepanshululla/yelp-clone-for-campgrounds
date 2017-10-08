var mongoose    = require("mongoose");

//SCHEMA Setup
var commentSchema = new mongoose.Schema({
   text: String,
   createdAt: { type: Date, default: Date.now },

   author: {
      id: {
         type: mongoose.Schema.Types.ObjectId,
         ref: "User"
      },
      fullname: String
   }
});

var Comment = mongoose.model("Comment",commentSchema);
module.exports= Comment;