var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

var NodeGeocoder = require('node-geocoder');
var geocoder = NodeGeocoder({
  provider: "google",
  apiKey: process.env.GEOCODING_API_KEY || "YOUR KEY HERE",
  httpAdapter: "https",
  formatter: null
});

// THE WALL - anything routes below this are protected!
router.use(function(req, res, next){
  if (!req.user) {
    res.redirect('/login');
  } else {
    return next();
  }
});

router.post('/restaurant/new', function(req, res, next) {

  console.log(req.body.name)

  geocoder.geocode(req.body.address, function(err, data) {
    if (err) {
      "Could not find data"
    } else {
      var restObj = {
        name: req.body.name,
        category: req.body.category,
        latitude: data[0].latitude,
        longitude: data[0].longitude,
        price: req.body.price,
        openTime: timeConverter(req.body.openTime),
        closingTime: timeConverter(req.body.closingTime),
      }
      var newRestaurant = new Restaurant(restObj);
      newRestaurant.save(function(err) {
        if (err) {
          console.log("Failure saving: " + err);
        } else {
          res.render('singleRestaurant', restObj);
        }
      });
    }
  });
});

router.get('/restaurant/:id', function(req, res, next) {
  Restaurant.findById(req.params.id, function(err, rest) {
    if (err) {
      console.log("Cannot find restaurant");
    } else {
      res.render('singleRestaurant', rest);
    }
  })
});


function timeConverter(stringTime) {
  var string = stringTime.split(":");
  return 60 * parseInt(string[0]) + parseInt(string[1]);
}


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


router.get('/restaurant/new', function(req, res, next) {
  res.render('newRestaurant');
});


module.exports = router;
