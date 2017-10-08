var mongoose    = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
// User-email,name,password
var UserSchema = new mongoose.Schema({
   email: { type: String, required: true, unique:true },
   fullname: { type: String, required: true },
   firstname:{ type: String, required: true },
   lastname:{ type: String, required: true },
   username: { type: String, required: true, index: { unique: true } },
   password: { type: String},
   avatar:  {type: String, default:"https://www.timeshighereducation.com/sites/default/files/byline_photos/default-avatar.png"},
   resetPasswordToken: String,
   resetPasswordExpires: Date,
   isAdmin:  {type: Boolean, default: false}
  
});
// provides additional methods for authentication
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);