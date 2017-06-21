var mongoose = require('mongoose');

// Step 0: Remember to add your MongoDB information in one of the following ways!
var connect = process.env.MONGODB_URI || require('./connect');
mongoose.connect(connect);

var userSchema = mongoose.Schema({
  displayName: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  location:  String
});


var FollowsSchema = mongoose.Schema({
  from: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  },
  to: {
    type: mongoose.Schema.ObjectId,
    ref: 'User'
  }
});

var reviewSchema = mongoose.Schema({

});


var restaurantSchema = mongoose.Schema({

});


userSchema.methods.getFollows = function (callback){
  var self = this;
  Follow.find({to: self._id}).populate('to').exec(function(err, allFollowers) {
    if (err) {
      callback(err, null, null);
    } else {
      Follow.find({from: self._id}).populate('from').exec(function(err, allFollowing) {
        if (err) {
          callback(err, null, null);
        } else {
          callback(null, allFollowers, allFollowing);
        }
      });
    }
  });
};

userSchema.methods.follow = function (idToFollow, callback){
  var self = this;
  Follow.findOne({from: this._id, to: idToFollow}, function(err, follow) {
    if (err) {
      callback(err, {success: false});
    } else {
      if (!follow) {
        var followObj = new Follow({from: self._id, to: idToFollow});
        followObj.save(function(err, result) {
          if (err) {
            callback(err, {success: false});
          } else {
            callback(null, {success: true});
          }
        });
      } else {
        callback(err, {success: false});
      }
    }
  });
};

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToUnfollow}, function(err, follow) {
    if (err) {
      callback(err, {success: false});
    } else {
      callback(null, {success: true});
    }
  });
};

userSchema.methods.isFollowing = function (id, callback){
  Follow.find({from: this._id, to: id}, function(err, follow) {
    if (err) {
      callback(err, null);
    } else {
      callback(null, !!follow);
    }
  });
};



restaurantSchema.methods.getReviews = function (restaurantId, callback){

}


var User = mongoose.model('User', userSchema);
var Restaurant = mongoose.model('Restaurant', restaurantSchema);
var Review = mongoose.model('Review', reviewSchema);
var Follow = mongoose.model('Follow', FollowsSchema);


module.exports = {
  User: User,
  Restaurant: Restaurant,
  Review: Review,
  Follow: Follow
};
