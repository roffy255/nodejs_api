var express = require('express');
var morgan = require('morgan');
var path = require("path");
var app = express();
var config = require('./config');
require('./events');

require('./db.js');
// import all routes
var authRoute = require('./controllers/auth');
var userRoute = require("./controllers/user");
var productRoute = require("./controllers/product")();
// console.log('productROute', productRoute);

// 1 application level middleware
var authenticate = require('./middlewares/authenticate');
var authorize = require('./middlewares/authorize');

//load api route
var apiRoute = require('./routes/api.routes')(authenticate, authorize);

var pug = require('pug');
// app.set('port', 6000);
app.set('view engine', 'pug');
app.set('views', 'views');

//third party middleware
var cors = require('cors');
app.use(morgan('dev'));
app.use(cors())



///socket stuff
var users = [];
var socket = require('socket.io');
var io = socket(app);
io.on('connection', function (client) {
    var id = client.id;
    console.log('client connected to server');
    client.on('new-msg', function (data) {
        console.log('msg in new-msg', data);
        client.emit('new-msg', data);
        client.broadcast.to(data.receiver).emit('new-msg-return', data);
    });
    client.on('user', function (data) {
        users.push({ id: id, name: data });
        client.emit('users', users);
        client.broadcast.emit('users', users);
    });
    client.on('is-typing', function (data) {
        client.broadcast.to(data.receiver).emit('is-typing', data);
    })

    client.on('typing-stop', function (data) {
        client.broadcast.to(data.receiver).emit('typing-stop', data);
    })

    client.on('disconnect', function () {
        users.forEach(function (item, index) {
            if (item.id == id) {
                users.splice(index, 1);
            }
        });
        client.emit('users', users);
        client.broadcast.emit('users', users);
    });

});




////socket stuff close

// inbuilt middleware
// app.use(expres.static('files'));
app.use('/img', express.static(path.join(__dirname, 'files')));
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json());

// router level middleware
app.use('/auth', authRoute);
app.use('/user', authenticate, userRoute);
app.use('/product', authenticate, productRoute);
app.use('/message', userRoute);
app.use('/comment', authenticate, authorize, userRoute);
app.use('/gallery', authRoute);
app.use('/api', apiRoute);

app.use(function (req, res, next) {
    console.log('i am 404 handler middleware below routing');
    next({
        message: 'Not Found',
        status: 404
    });
});

// error handling middlware
app.use(function (err, req, res, next) {
    // the first argument or err is error for error handling middleware
    console.log('i am error handling middleware', err);
    res.status(err.status || 400);
    res.json({
        result: err.message || err,
        status: err.status || 400
    });
});


app.listen(process.env.PORT || 8080, function (err, done) {
    if (err) {
        console.log('error in listening ');
    } else {
        console.log('server listening at port' + config.port);
        console.log('press CTRL + C to exit');
    }
});