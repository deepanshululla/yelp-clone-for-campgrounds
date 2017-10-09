var express         = require("express"),
    app             = express(),
    bodyParser      = require("body-parser"),
    mongoose        = require("mongoose"),
    passport        = require("passport"),
    LocalStrategy   = require("passport-local"),
    Campground      = require("./models/campground"),
    Comment         = require("./models/comment"),
    User            = require("./models/user"),
    expressSession  = require("express-session"),
    seedDB          = require("./seeds");
    
seedDB();

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
//conect to db
mongoose.connect("mongodb://localhost/yelp_camp_v3",{useMongoClient: true});
mongoose.connection.on('open', function(){
   console.log('Mongoose connected'); 
});

// Passport configuration
app.use(expressSession({
    secret:"Some random string",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Custom middleware created for
// sending current user data to each page
app.use(function(req,res, next){
    res.locals.currentUser = req.user;
    next();
});


// =============================
// Campground Routes
// ==============================
app.get('/', function (req,res) {
    res.render("landing");
});

//INDEX - show all campgrounds
app.get("/campgrounds", function(req, res){
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
app.get("/campgrounds/new", function(req, res){
    //find camppground by id
    
    res.render("campgrounds/new"); 
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
            res.render("campgrounds/show", {campground: foundCampground});
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


// =============================
// Comment Routes
// ==============================
app.get("/campgrounds/:id/comments/new", isLoggedIn, function (req, res) {
    Campground.findById(req.params.id, function (err, campground) {
        if(err){
            console.log(err);
        } else {
            res.render("comments/new", {campground:campground});
        }
    });
    
});

app.post("/campgrounds/:id/comments", isLoggedIn,function (req, res) {
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
                   campground.comments.push(comment);
                   campground.save();
                   res.redirect("/campgrounds/"+campground._id)
               }
           });
        }
    });
});

// =============================
// Auth Routes
// ==============================

//show register form
app.get("/register", function(req, res) {
   res.render('register'); 
});

// register user handle sign up logic
app.post("/register", function(req, res) {
    var newUser= new User({username: req.body.username,fullname: req.body.fullname,email: req.body.email});
    User.register(newUser, req.body.password, function (err, user) {
       if(err){
           console.log(err);
           return res.render('register');
       } else {
           passport.authenticate("local")(req,res, function () {
               res.redirect('/campgrounds');
           });
       }
    });
});

//show login form
app.get("/login", function(req, res) {
    
   res.render('login');
});

app.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login"
}), function(req, res) {
    
});

//logout
app.get("/logout", function(req, res) {
    req.logout();
    res.redirect("/campgrounds");
});


function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    } 
    res.redirect("/login");
}

// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('YelpCamp Server up: http://' + app.get('ip') +":"+ app.get('port'));
});