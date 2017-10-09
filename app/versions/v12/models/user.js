var mongoose    = require("mongoose");

var passportLocalMongoose = require("passport-local-mongoose");
// User-email,name,password
var UserSchema = new mongoose.Schema({
   email: { type: String, required: true },
   fullname: { type: String, required: true },
   username: { type: String, required: true, index: { unique: true } },
   password: { type: String},
  
});
// provides additional methods for authentication
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);