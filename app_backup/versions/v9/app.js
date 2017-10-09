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
    

// requiring routes
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes       = require("./routes/index");
    

app.set("view engine","ejs");
app.use(express.static(__dirname+'/public'));
//__dirname gives the current directory 
app.use(bodyParser.urlencoded({extended: true}));
//conect to db
mongoose.connect("mongodb://localhost/yelp_camp_v3",{useMongoClient: true});
mongoose.connection.on('open', function(){
   console.log('Mongoose connected'); 
});

// seed the DB
// seedDB();

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

app.use("/",indexRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "0.0.0.0");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('YelpCamp Server up: http://' + app.get('ip') +":"+ app.get('port'));
});