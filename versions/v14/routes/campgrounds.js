var express     = require("express"),
    router      = express.Router(),
    Campground  = require("../models/campground"),
    middleware  = require("../middleware"),
    geocoder    = require("geocoder");


// =============================
// Campground Routes
// ==============================

//INDEX - show all campgrounds
router.get("/", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
          console.log(err);
          return res.redirect("back");
       } else {
          res.render("campgrounds/index",{campgrounds:allCampgrounds, page: 'campgrounds'});
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
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found.");
            return res.redirect("back");
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
    var price = req.body.price;
    var author={
        id: req.user._id,
        username: req.user.username,
        fullname: req.user.fullname
        
    }
    geocoder.geocode(req.body.location, function (err, data) {
         if(err){
            console.log(err);
            return res.redirect("back");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newCampground = {name: name, image: image, description: desc, price: price, author:author, location: location, lat: lat, lng: lng};
            // Create a new campground and save to DB
            Campground.create(newCampground, function(err, newlyCreated){
                if(err){
                    console.log(err);
                } else {
                    //redirect back to campgrounds page
                    console.log(newlyCreated);
                    res.redirect("/campgrounds");
                }
            });
     }
  });
});

// edit campground route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req, res) {
    // is user logged in
    Campground.findById(req.params.id,function(err, foundCampground){
        if(err || !foundCampground){
            console.log(err);
            req.flash("error","Campground not found.");
            return res.redirect("back");
        } else {
            //render edit template with that campground
            res.render("campgrounds/edit", {campground: foundCampground});
        }});
});


// Update campground route
router.put("/:id",middleware.checkCampgroundOwnership,function (req, res) {
    // find and update the correct campground
   
 geocoder.geocode(req.body.location, function (err, data) {
     if(err){
            console.log(err);
            return res.redirect("back");
        } else {
            var lat = data.results[0].geometry.location.lat;
            var lng = data.results[0].geometry.location.lng;
            var location = data.results[0].formatted_address;
            var newData = {name: req.body.name, image: req.body.image, description: req.body.description, cost: req.body.cost, location: location, lat: lat, lng: lng};
            Campground.findByIdAndUpdate(req.params.id, {$set: newData}, function(err, campground){
                if(err || !req.body.id){
                    console.log(err);
                    req.flash("error", err.message);
                    res.redirect("back");
                } else {
                    req.flash("success","Successfully Updated!");
                    res.redirect("/campgrounds/" + campground._id);
                }
            });
    }
  });
});


// Destroy Campground route
router.delete("/:id",middleware.checkCampgroundOwnership ,function(req,res){
    // res.send("You are trying to delete something");
    Campground.findByIdAndRemove(req.params.id, function (err) {
        if(err || !req.params.id){
            console.log(err);
            res.redirect('/campgrounds');
        } else {
            req.flash("info","Successfuly deleted campground");
            res.redirect('/campgrounds');
        }
    });
});



module.exports = router;