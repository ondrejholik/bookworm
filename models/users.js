var mongoose = require('mongoose');
var bcrypt = require('bcrypt');

var UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
    trim: true,
  },
  favoriteBook: {
    type: String,
    required: true,
    trim: true
  },
  password: {
    type: String,
    required: true
  }
});
// encrypt password
UserSchema.pre("save", function(next){
  var user = this;
  bcrypt.hash(user.password, 10, function(err, hash){
    if(err){
      return next(err);
    }

    user.password = hash;
    next();

  });
})

UserSchema.statics.authenticate = function(email, password, callback) {
  User.findOne({email: email})
      .exec(function(error, user){
        if(error){
          return callback(error)
        }
        else if(!user){
          var er =  callback(new Error("User not found"))
          er.status = 401;
          return callback(er);

        }

        bcrypt.compare(password, user.password, function(error, result){
          if(result === true){
            return callback(null, user)
          }
          if(error){
            return callback(error)
          }

        })
      })
}

var User = mongoose.model('User', UserSchema);
module.exports = User;
