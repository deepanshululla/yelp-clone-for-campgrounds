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
    change_description()
    //remove all campgrounds
    removeAllCampgrounds();
    //add a few campgrounds
    //addCampgrounds();
    //add comments
    
}

function change_description() {
    data.forEach(function(seed) {
        seed["description"]="Lorem ipsum dolor sit amet, labore iuvaret facilisis in mea, est blandit intellegebat an. Dicunt praesent eos eu, an impetus aliquam ullamcorper eum. Fugit maluisset suscipiantur cum id. Est doctus percipitur ex, duo ex alia vidisse lobortis. Sea no principes eloquentiam."+
                        "Ea esse purto offendit his. Facer dolores dissentias eam ex. Et dicit nostrum ancillae vis, posse alienum noluisse ex vix. Eu mel augue option reprimique, lucilius mediocrem ex est. Pro cu purto quaeque. An nam hinc phaedrum adolescens, quando definiebas intellegam cu mea."+
                        "Novum decore vel eu, error explicari voluptaria no eam, an nec alia instructior. Eam ad congue menandri mediocritatem. Altera propriae eu pro, quas eruditi omittantur in vis, et appareat referrentur mel. Omnis ornatus hendrerit mea in. Viderer accommodare et mea. Ne vix justo"+ 
                        "graece, sea choro suscipit ut. His nobis detracto delicatissimi te.";
    });
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
            //   console.log("Added Campground", campground);
               console.log("Adding campground");
              Comment.create({
                  text: "This place is awesome. Wish it had internet",
                  author: "Romer"
              }, function (err, comment) {
                  if(err){
                      console.log(err);
                  } else {
                      campground.comments.push(comment);
                      campground.save();
                    //   console.log("Added comment ", comment, " to Campground", seed);
                    console.log("Adding comment");
                  }
              });
           }
       });
    });
}



module.exports=seedDB;