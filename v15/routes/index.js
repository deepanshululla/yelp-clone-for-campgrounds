var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    User        = require("../models/user");

router.get('/', function (req,res) {
    res.render("landing");
});
// =============================
// Auth Routes
// ==============================

//show register form
router.get("/register", function(req, res) {
   res.render('register',{page: 'register'}); 
});

// register user handle sign up logic
router.post("/register", function(req, res) {
    
    var newUser= new User({username: req.body.username,fullname: req.body.fullname,email: req.body.email});
    // eval(require("locus"));
    if (req.body.adminCode==="secretCode123"){
        newUser.isAdmin=true;
    }
    User.register(newUser, req.body.password, function (err, user) {
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.redirect('/register');
       } else {
           passport.authenticate("local")(req,res, function () {
               
               req.flash("success","Welcome to YelpCamp "+user.fullname);
               return res.redirect('/campgrounds');
           });
       }
    });
});

//show login form
router.get("/login", function(req, res) {
   return res.render('login', {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash:true,
        successFlash:"WELCOME BACK!!!!"
}), function(req, res) {
    
});

//logout
router.get("/logout", function(req, res) {
    var fullname=req.user.fullname;
    req.logout();
    req.flash("info","Successfuly Logged you out. Bye "+fullname);
    return res.redirect("/campgrounds");
});



module.exports = router;