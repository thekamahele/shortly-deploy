var db = require('../config');

var Link = db.mongoose.model('urls', db.Urls)

module.exports = Link;





