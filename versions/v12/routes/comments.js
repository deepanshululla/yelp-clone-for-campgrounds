var express     = require("express"),
    router      = express.Router({mergeParams: true}),
    Campground  = require("../models/campground"),
    Comment     = require("../models/comment"),
    middleware  = require("../middleware");
    
// what merge params does is it supplies the campground id in the url to the router 
    
    
// =============================
// Comment Routes
// ==============================

//Comments new
router.get("/new", middleware.isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
    
});

// Comments Create
router.post("/",  middleware.isLoggedIn,function (req, res) {
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

// get edit form for comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req,res){
    var campground_id=req.params.id;
    Comment.findById(req.params.comment_id, function(err, foundComment) {
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.render("comments/edit",{campground_id:campground_id, comment:foundComment}); 
        }
    });
    
});

//comment update
router.put("/:comment_id", middleware.checkCommentOwnership, function (req,res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

router.delete("/:comment_id", middleware.checkCommentOwnership, function (req,res) {
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});




module.exports = router;