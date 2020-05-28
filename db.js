var mongoose = require('mongoose');
var config = require('./config/index');
var localUrl = config.dbUrl + '/' + config.dbName;
var remoteUrl = config.mlabUrl;
var url;

if (process.env.db == 'remote') {
    url = remoteUrl
} else {
    url = localUrl
}
mongoose.connect(remoteUrl, function (err, done) {
    if (err) {
        console.log('error in connecting to db');
    }
    else {
        console.log('db connection open');
    }
});