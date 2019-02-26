var express = require('express');
var User = require("../models/users");
var bcrypt = require("bcrypt");
var router = express.Router();

// GET PROFILE /

router.get('/profile', function(req, res, next){
  if(!req.session.userId){
    var err = new Error("Your are not authorize to view this content");
    err.status = 403;
    return next(err);
  }
  User.findById(req.session.userId)
      .exec(function(error, user){
        if(error){
          return next(error)
        }
        else{
          res.render('profile', {title:"Profile", name: user.name, favorite: user.favoriteBook})
        }
      })


});
// GET / LOGOUT
router.get('/logout', function(req, res, next){
    req.session.destroy(function(err){
      if(err){
        return next(err)
      }
      else{
        return res.redirect("/")
      }
    })
  
})

// GET /
router.get('/register', function(req, res, next) {
  return res.render("register", {title: "Register"})

});

// GET / LOGIN
router.get('/login', function(req, res, next){
  return res.render("login", {title: "Login"} )
});

// POST / LOGIN
router.post('/login', function(req, res, next){
  if( req.body.email && req.body.password){
       User.authenticate(req.body.email, req.body.password, function(error, user){
         if(error || !user){
           var err = new Error("Wrong password submitted");
           err.status = 401;
           return next(err)
         }
         else{
            req.session.userId = user._id;
            return res.redirect("/profile")
         }
       })
      }

  else{
    var err = new Error("Email and password are required");
    err.status = 401;
    return next(err)
  }
})

router.post('/register', function(req, res, next){
  
  if(req.body.email && 
     req.body.password &&
     req.body.favoriteBook &&
     req.body.confirmPassword &&
     req.body.name){
      if(req.body.password != req.body.confirmPassword){
        var err = new Error("Passwords doesnt match.");
        err.status = 401;
        return next(err);
      }
      var userData = {  email: req.body.email,
                        password: req.body.password,
                        favoriteBook: req.body.favoriteBook,
                        name: req.body.name
                      };

      User.create(userData, function(error, user){
        if (error){
          return next(error)
        }
        else {
          req.session.userId = user._id;
          return res.redirect("./profile");
        }
      });
      // Use schema create method to create a record in mongo database
      
      
      
     }
  
  else{
    var err = new Error("All fields are required.");
    err.status = 400;
    return next(err);
  }
})

// GET /
router.get('/', function(req, res, next) {
  return res.render('index', { title: 'Home' });
});

// GET /about
router.get('/about', function(req, res, next) {
  return res.render('about', { title: 'About' });
});

// GET /contact
router.get('/contact', function(req, res, next) {
  return res.render('contact', { title: 'Contact' });
});



module.exports = router;
