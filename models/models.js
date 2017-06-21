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
  location: {
    type: String,
    required: true
  }
});

userSchema.methods.getFollows = function (callback){
  Follow.find({to: this._id}).populate('User').exec(function(err, allFollowers) {
    if (err) {
      callback(err, null, null);
    } else {
      Follow.find({from: this._id}).populate('User').exec(function(err, allFollowing) {
        if (err) {
          callback(err, null, null);
        } else {
          callback(null, allFollowers, allFollowing);
        }
      })
    }
  })
}

userSchema.methods.follow = function (idToFollow, callback){
  Follow.findOne({from: this._id, to: idToFollow}, function(err, follow) {
    if (err) {
      callback(err, {success: false})
    } else {
      if (follow.length == 0) {
        var followObj = new Follow({from: this._id, to: idToFollow});
        followObj.save(function(err, result) {
          if (err) {
            callback(err, {success: false})
          } else {
            callback(null, {success: true})
          }
        })
      } else {
        callback(err, {success: false})
      }
    }
  })
}

userSchema.methods.unfollow = function (idToUnfollow, callback){
  Follow.remove({from: this._id, to: idToUnfollow}, function(err, follow) {
    if (err) {
      callback(err, {success: false})
    } else {
      callback(null, {success: true})
    }
  })
}

userSchema.methods.isFollowing = function (id, callback){
  Follow.find({from: this._id, to: id}, function(err, follow) {
    if (err) {
      callback(err, null)
    } else {
      callback(null, !!follow);
    }
  })
}

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
  name: String,
  category: {
    type: String,
    enum: ['Korean', 'Barbeque', 'Casual']
  },
  latitude: Number,
  longitude: Number,
  price: Number,
  openTime: Number,
  closingTime: Number
});

var openTimeParsed = restaurantSchema.virtual('realOpen');
var closedTimeParsed = restaurantSchema.virtual('realClose');

openTimeParsed.get(function() {
  return readableTimeConvert(this.openTime);
})

closedTimeParsed.get(function() {
  return readableTimeConvert(this.closingTime);
})

function readableTimeConvert(minutesTime) {
  var minutes = minutesTime % 60;

  if(minutes < 10) {
    minutes = "0" + minutes;
  }

  var hours = Math.floor(minutesTime / 60);

  if (hours > 12) {
    hours -= 12;
    return hours + ":" + minutes + " PM";
  } else {
    return hours + ":" + minutes + " AM";
  }
}

restaurantSchema.methods.getReviews = function (restaurantId, callback){

}

//restaurantSchema.methods.stars = function(callback){
//
//}


module.exports = {
  User: mongoose.model('User', userSchema),
  Restaurant: mongoose.model('Restaurant', restaurantSchema),
  Review: mongoose.model('Review', reviewSchema),
  Follow: mongoose.model('Follow', FollowsSchema)
};
