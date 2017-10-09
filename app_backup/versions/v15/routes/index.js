var express     = require("express"),
    router      = express.Router(),
    passport    = require("passport"),
    async       = require("async"),
    nodemailer  = require("nodemailer"),
    crypto      = require("crypto"),
    User        = require("../models/user"),
    Campground  = require("../models/campground");

router.get('/', function (req,res) {
    res.render("landing");
});
// =============================
// Auth Routes
// ==============================

//show register form
router.get("/register", function(req, res) {
   res.render('register',{page: 'register'}); 
});

// register user handle sign up logic
router.post("/register", function(req, res) {
    var fullname=req.body.firstname+" "+req.body.lastname;
    
    var newUser= new User({
        username: req.body.username,
        fullname:fullname,
        firstname:req.body.firstname,
        lastname:req.body.lastname,
        email: req.body.email,
        avatar: req.body.avatar
    });
    // eval(require("locus"));
    if (req.body.adminCode==="secretCode123"){
        newUser.isAdmin=true;
    }
    User.register(newUser, req.body.password, function (err, user) {
       if(err){
           console.log(err);
           req.flash("error", err.message);
           return res.redirect('/register');
       } else {
           passport.authenticate("local")(req,res, function () {
               
               req.flash("success","Welcome to YelpCamp "+user.fullname);
               return res.redirect('/campgrounds');
           });
       }
    });
});

//show login form
router.get("/login", function(req, res) {
   return res.render('login', {page: 'login'});
});

router.post("/login", passport.authenticate("local", {
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash:true,
        successFlash:"WELCOME BACK!!!!"
}), function(req, res) {
    
});

// Users profiles
router.get("/users/:user_id", function(req, res) {
   User.findById(req.params.user_id, function (err, foundUser) {
       if(err || !foundUser){
           console.log(err);
           req.flash("error","Something went wrong");
           return res.redirect("/");
       } else {
        //   find all campground posts by user
           Campground.find().where('author.id').equals(foundUser._id).exec(function (err,foundCampgrounds) {
               if(err || !foundUser || !foundCampgrounds){
                   console.log(err);
                    req.flash("error","Something went wrong");
                    return res.redirect("/");
               } else {
                   res.render("users/show",{user:foundUser,campgrounds:foundCampgrounds});
               }
           }) 
           
       }
   });
});

//logout
router.get("/logout", function(req, res) {
    var fullname=req.user.fullname;
    req.logout();
    req.flash("info","Successfuly Logged you out. Bye "+fullname);
    return res.redirect("/campgrounds");
});

// forgot password
router.get('/forgot', function(req, res) {
  res.render('forgot');
});

//send password link to the email in form
router.post('/forgot', function(req, res, next) {
  async.waterfall([
    function(done) {
      crypto.randomBytes(20, function(err, buf) {
        var token = buf.toString('hex');
        done(err, token);
      });
    },
    function(token, done) {
      User.findOne({ email: req.body.email }, function(err, user) {
        if (!user) {
          req.flash('error', 'No account with that email address exists.');
          return res.redirect('/forgot');
        }

        user.resetPasswordToken = token;
        user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

        user.save(function(err) {
          done(err, token, user);
        });
      });
    },
     
    // function(token, user, done) {
    //     // create reusable transporter object using the default SMTP transport
    //     let transporter = nodemailer.createTransport({
    //         host: 'smtp.ethereal.email',
    //         port: 587,
    //         secure: false, // true for 465, false for other ports
    //         auth: {
    //             user: account.user, // generated ethereal user
    //             pass: account.pass  // generated ethereal password
    //         }
    //     });
    //   var smtpTransport = nodemailer.createTransport({
    //     service: 'Gmail', 
    //     auth: {
    //       user: 'deepanshululla17@gmail.com',
    //       pass: process.env.GMAILPW
    //     }
    //   });
    //   var mailOptions = {
    //     to: user.email,
    //     from: 'deepanshululla17@gmail.com',
    //     subject: 'Node.js Password Reset',
    //     text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
    //       'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
    //       'http://' + req.headers.host + '/reset/' + token + '\n\n' +
    //       'If you did not request this, please ignore this email and your password will remain unchanged.\n'
    //   };
    //   transporter.sendMail(mailOptions, function(err) {
    //     console.log('mail sent');
    //     req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
    //     done(err, 'done');
    //   });
    // }
    function(token, user, done) {
        nodemailer.createTestAccount((err, account) => {
    
        // create reusable transporter object using the default SMTP transport
        let transporter = nodemailer.createTransport({
            host: 'smtp.ethereal.email',
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: account.user, // generated ethereal user
                pass: account.pass  // generated ethereal password
            }
        });
    
        // setup email data with unicode symbols
          var mailOptions = {
            to: user.email,
            from: 'help@yelpcamp.com',
            subject: 'Node.js Password Reset',
            text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
              'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
              'http://' + req.headers.host + '/reset/' + token + '\n\n' +
              'If you did not request this, please ignore this email and your password will remain unchanged.\n'
          };
    
        // send mail with defined transport object
        transporter.sendMail(mailOptions, function(error, info){
             // console.log('Message sent: %s', info.messageId);
            req.flash('success', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
            // Preview only available when sending through an Ethereal account
            console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
            done(error, 'done');
            
    
            // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@blurdybloop.com>
            // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...
        }
           
           
        );
    });
    }
  ], function(err) {
    if (err) return next(err);
    res.redirect('/forgot');
  });
});

// get password reset page
router.get('/reset/:token', function(req, res) {
  User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
    if (!user) {
      req.flash('error', 'Password reset token is invalid or has expired.');
      return res.redirect('/forgot');
    }
    res.render('reset', {token: req.params.token});
  });
});

// submit updated password
router.post('/reset/:token', function(req, res) {
  async.waterfall([
    function(done) {
      User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function(err, user) {
        if (!user) {
          req.flash('error', 'Password reset token is invalid or has expired.');
          return res.redirect('back');
        }
        if(req.body.password === req.body.confirm) {
          user.setPassword(req.body.password, function(err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpires = undefined;

            user.save(function(err) {
              req.logIn(user, function(err) {
                done(err, user);
              });
            });
          })
        } else {
            req.flash("error", "Passwords do not match.");
            return res.redirect('back');
        }
      });
    },
    function(user, done) {
      var smtpTransport = nodemailer.createTransport({
        service: 'Gmail', 
        auth: {
          user: 'deepanshululla17@gmail.com',
          pass: process.env.GMAILPW
        }
      });
      var mailOptions = {
        to: user.email,
        from: 'learntocodeinfo@mail.com',
        subject: 'Your password has been changed',
        text: 'Hello,\n\n' +
          'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
      };
      smtpTransport.sendMail(mailOptions, function(err) {
        req.flash('success', 'Success! Your password has been changed.');
        done(err);
      });
    }
  ], function(err) {
    res.redirect('/campgrounds');
  });
});

module.exports = router;