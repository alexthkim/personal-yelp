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
  User.findOne({"_id": req.params.id}, function(err, result) {
    if (err) {
      console.log("Server Error")
    } else {
      result.getFollows(function(err, allFollowers, allFollowing) {
        if (err) {
          console.log("Error getting following data")
        } else {
          res.render('singleProfile', {
            user: result,
            followers: allFollowers,
            following: allFollowing
          });
        }
      })
    }
  })
});

module.exports = router;
