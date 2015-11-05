var app = require('./server-config.js');

console.log('process', process.env.PORT)
app.listen(process.env.PORT || 3000);

console.log('Server now listening on port ' + process.env.PORT);
