var db = require('../config');

var User = db.mongoose.model('user', db.User)

module.exports = User;

