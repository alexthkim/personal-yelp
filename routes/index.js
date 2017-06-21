var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

// Geocoding - uncomment these lines when the README prompts you to!
// var NodeGeocoder = require('node-geocoder');
// var geocoder = NodeGeocoder({
//   provider: "google",
//   apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
//   httpAdapter: "https",
//   formatter: null
// });

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurants/new', function(req, res, next) {

  // Geocoding - uncomment these lines when the README prompts you to!
  // geocoder.geocode(req.body.address, function(err, data) {
  //   console.log(err);
  //   console.log(data);
  // });

});





router.get('/users/:id', function(req, res, next) {
  User.findOne({"_id": req.params.id}, function(err, user) {
    if (err) {
      res.status(500).send("Could not retrieve user from database");
    } else {
      user.getFollows(function(err, allFollowers, allFollowing) {
        if (err) {
        } else {
          res.render('singleProfile', {
            user: user,
            followers: allFollowers,
            following: allFollowing
          });
        }
      });
    }
  });
});


router.get("/profiles", function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(500).send("Could not retrieve users from database");
    } else {
      res.render("profiles", {users: users});
    }
  });
});


router.get("/profiles", function(req, res, next) {
  User.find({}, function(err, users) {
    if (err) {
      res.status(500).send("Could not retrieve users from database");
    } else {
      res.render("profiles", {users: users});
    }
  });
});




module.exports = router;
