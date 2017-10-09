var express=require("express");
var app=express();
var bodyParser= require("body-parser");

app.set("view engine","ejs");
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));

var campgrounds = [
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"},
        {name: "Salmon Creek", image: "https://farm9.staticflickr.com/8442/7962474612_bf2baf67c0.jpg"},
        {name: "Granite Hill", image: "https://farm1.staticflickr.com/60/215827008_6489cd30c3.jpg"},
        {name: "Mountain Goat's Rest", image: "https://farm7.staticflickr.com/6057/6234565071_4d20668bbd.jpg"}
];

app.get('/', function (req,res) {
    res.render("landing");
});

app.get("/index", function(req, res){
    res.render("index",{campgrounds:campgrounds});
});

app.get("/campgrounds/new", function(req, res){
    res.render("new");
});

app.post("/index", function(req,res){
    // get data from form and add to campgrounds array
    // redirect back to campgrounds page
    
    var name=req.body.name;
    var image=req.body.image;
    var newCampground={name: name, image: image};
    campgrounds.push(newCampground);
    res.redirect("/index");
    
});


// Starting listener
app.set('port', process.env.PORT || 3000);
app.set('ip', process.env.IP || "127.0.0.1");
app.listen(app.get('port'),app.get('ip'), function(){
    console.log('YelpCamp Server up: http://' + app.get('ip') +":"+ app.get('port'));
});