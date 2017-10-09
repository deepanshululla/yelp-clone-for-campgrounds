var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment");
    
// what merge params does is it supplies the campground id in the url to the router 
    
    
// =============================
// Comment Routes
// ==============================

//Comments new
router.get("/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
    
});

// Comments Create
router.post("/", isLoggedIn,function (req, res) {
    //lookup campground using id and then create new comment
    //connect new comment to campground
    // redirect somewhere to the campground showpage
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
           Comment.create(req.body.comment, function (err, comment) {
               if(err){
                   console.log(err);
               } else {
                    // add username and id to comments
                   comment.author.id=req.user._id;
                   comment.author.fullname=req.user.fullname;
                   //save comment
                   comment.save();
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id)
               }
           });
        }
    });
});

//middleware
function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

module.exports = router;