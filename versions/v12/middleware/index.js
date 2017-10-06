var Campground      = require("../models/campground"),
    Comment         = require("../models/comment"),
    User            = require("../models/user");

var middlewareObj={}

middlewareObj.isLoggedIn=function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership=function(req, res, next){
    if (req.isAuthenticated()){
        Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
            // does user own the campground
            if(foundCampground.author.id.equals(req.user._id)){
                //render edit template with that campground
                // res.render("campgrounds/edit", {campground: foundCampground});
                next();
            }
            // console.log(foundCampground.author.id);// is a mongoose object
            // console.log(req.user._id);// is a string
            else {
                res.redirect("back");
            }
        }
    });
    }else{
        res.redirect("back");
        // take the user back from the page they came from
    }
}



middlewareObj.checkCommentOwnership=function(req, res, next){
        if (req.isAuthenticated()){
            Comment.findById(req.params.comment_id,function(err, foundComment){
                if(err){
                    console.log(err);
                    res.redirect("back");
                } else {
                    // does user own the campground
                    if(foundComment.author.id.equals(req.user._id)){
                        next();
                    }
                    else {
                        res.redirect("back");
                    }
                }
            });
        }else{
            res.redirect("back");
            // take the user back from the page they came from
        }
}

module.exports = middlewareObj;