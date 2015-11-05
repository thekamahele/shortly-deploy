var path = require('path');
var mongoose = require('mongoose');
console.log(process.env.db)
mongoose.connect(process.env.db || 'mongodb://localhost/test')
var bcrypt = require('bcrypt-nodejs');
var Promise = require('bluebird');


var mdb = mongoose.connection;
mdb.on('error', console.error.bind(console, 'connection error:'));
mdb.once('open', function (callback) {
  console.log('connected!!!!!!!!!!!')
  // yay!
});


var mondb = {};

mondb.User = new mongoose.Schema({
  username: String,
  password: String
});

mondb.mongoose = mongoose;

mondb.Urls = new mongoose.Schema({
  url: String,
  base_url: String,
  code: String,
  title: String,
  visits: Number
});

mondb.User.methods.hashPassword = function(callback){
    var cipher = Promise.promisify(bcrypt.hash);
    return cipher(this.password, null, null).bind(this)
      .then(function(hash) { 
        this.password = hash;
        callback()
      });
}

mondb.User.methods.comparePassword = function(attemptedPassword, callback) {
  console.log('attempted:', attemptedPassword)
  console.log('this:', this.password)
    bcrypt.compare(attemptedPassword, this.password, function(err, isMatch) {

      callback(isMatch);
    });
  },
module.exports = mondb;
