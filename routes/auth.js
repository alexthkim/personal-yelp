// Add Passport-related auth routes here.

var express = require('express');
var router = express.Router();
var models = require('../models/models');
var User = models.User;
var Follow = models.Follow;
var Restaurant = models.Restaurant;
var Review = models.Review;

module.exports = function(passport) {

  // GET registration page
  router.get('/signup', function(req, res) {
    res.render('signup');
  });

  // POST registration page
  var validateReq = function(userData) {
    return (userData.password === userData.passwordRepeat);
  };

  router.post('/signup', function(req, res) {
    console.log(req.body.username);
    console.log(req.body.displayName);
    console.log(req.body.password);
    if (!validateReq(req.body)) {
      return res.render('signup', {
        error: "Passwords don't match."
      });
    }
    var u = new models.User({
      email: req.body.username,
      displayName: req.body.displayName,
      password: req.body.password
    });

    u.save(function(err, user) {
      if (err) {
        console.log(err);
        res.status(500).redirect('/register');
        return;
      }
      console.log(user);
      res.redirect('/login');
    });
  });

  // GET Login page
  router.get('/login', function(req, res) {
    res.render('login');
  });

  // POST Login page
  router.post('/login', passport.authenticate('local'), function(req, res) {
    User.findOne({email: req.body.username, password: req.body.password}, function(err, user) {
      if (err) {
        res.status(500).send("User not in databse");
      } else {
        res.redirect("/users/" + user._id);
      }
    });
  });

  // GET Logout page
  router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/login');
  });

  router.post("/follow/:id", function(req, res, next) {
    User.findOne({_id: req.user._id}, function(err, user) {
      if (err) {
        res.status(500).send("Could not retrieve user from database");
      } else {
        user.follow(req.params.id, function(err, successLog) {
          if (err) {
            res.status(500).send("Could not retrieve user from database");
          } else {
            res.redirect("/profiles");
          }
        });
      }
    });
  });

  return router;
};
