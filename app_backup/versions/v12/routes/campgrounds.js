var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware");


// =============================
// Campground Routes
// ==============================

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    // console.log(req.user);
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds});
       }
    });
});

//NEW - show form to create new campground
router.get("/new",middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
});

// SHOW - shows more info about one campground
router.get("/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            // console.log("Found Campground", foundCampground);
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
})



//CREATE - add new campground to DB
router.post("/",middleware.isLoggedIn, function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var author={
        id: req.user._id,
        username: req.user.username,
        fullname: req.user.fullname
        
    }
    var newCampground = {name: name, image: image, description: desc, author:author};
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            console.log("Created new campground:"+newlyCreated);
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
            
        }
    });
});

// edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    // is user logged in
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            //render edit template with that campground
            res.render("campgrounds/edit", {campground: foundCampground});
        }});
});


// Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function (req, res) {
    // find and update the correct campground
    
    Campground.findByIdAndUpdate(req.params.id,req.body.campground, function (err) {
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds/"+req.params.id);
        }
    });
});

// Destroy Campground route
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req,res){
    // res.send("You are trying to delete something");
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            res.redirect('/campgrounds');
        }
    });
});



module.exports = router;