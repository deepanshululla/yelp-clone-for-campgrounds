var express     = require("express"),
    app         = express(),
    bodyParser  = require("body-parser"),
    mongoose    = require("mongoose"),
    Campground  = require("./models/campground"),
    seedDB      = require("./seeds");
    
seedDB();

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//conect to db
mongoose.connect("mongodb://localhost/yelp_camp_v3",{useMongoClient: true});
mongoose.connection.on('open', function(){
   console.log('Mongoose connected'); 
});



app.get('/', function (req,res) {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(err, allCampgrounds){
       if(err){
           console.log(err);
       } else {
          res.render("index",{campgrounds:allCampgrounds});
       }
    });
});

//NEW - show form to create new campground
app.get("/campgrounds/new", function(req, res){
   res.render("new.ejs"); 
});

// SHOW - shows more info about one campground
app.get("/campgrounds/:id", function(req, res){
    //find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log("Found Campground", foundCampground);
            //render show template with that campground
            res.render("show", {campground: foundCampground});
        }
    });
})



//CREATE - add new campground to DB
app.post("/campgrounds", function(req, res){
    // get data from form and add to campgrounds array
    var name = req.body.name;
    var image = req.body.image;
    var desc = req.body.description;
    var newCampground = {name: name, image: image, description: desc}
    // Create a new campground and save to DB
    Campground.create(newCampground, function(err, newlyCreated){
        if(err){
            console.log(err);
        } else {
            //redirect back to campgrounds page
            res.redirect("/campgrounds");
        }
    });
});


// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "127.0.0.1");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('YelpCamp Server up: http://' + app.get('ip') +":"+ app.get('port'));
});