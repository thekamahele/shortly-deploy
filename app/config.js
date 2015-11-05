var Bookshelf = require('bookshelf');
var path = require('path');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/test')
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

module.exports = mondb;
