var mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    Comment    = require("./models/comment");
    
var data = [
    {
        name: "Cloud's Rest", 
        image: "https://farm4.staticflickr.com/3795/10131087094_c1c0a1c859.jpg",
        description: "blah blah blah"
    },
    {
        name: "Desert Mesa", 
        image: "https://farm6.staticflickr.com/5786/20607281024_5c7b3635cc.jpg",
        description: "blah blah blah"
    },
    {
        name: "Canyon Floor", 
        image: "https://farm1.staticflickr.com/189/493046463_841a18169e.jpg",
        description: "blah blah blah"
    }
]

function seedDB() {
    //remove all campgrounds
    removeAllCampgrounds();
    //add a few campgrounds
    addCampgrounds();
    //add comments
    
}

function removeAllCampgrounds(){
    Campground.remove({}, function (err) {
        if(err){
            console.log(err);
        } else {
            console.log("Removed all Campgrounds");
        }
    });
}

function addCampgrounds() {
    data.forEach(function (seed) {
       Campground.create(seed, function (err, campground) {
           if(err) {
               console.log(err);
           } else {
               console.log("Added Campground", campground);
              Comment.create({
                  text: "This place is awesome. Wish it had internet",
                  author: "Romer"
              }, function (err, comment) {
                  if(err){
                      console.log(err);
                  } else {
                      campground.comments.push(comment);
                      campground.save();
                      console.log("Added comment ", comment, " to Campground", seed);
                  }
              });
           }
       });
    });
}



module.exports=seedDB;