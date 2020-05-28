var jwt = require('jsonwebtoken');
var config = require('./../config');
var UserModel = require('./../models/user.model');
module.exports = function (req, res, next) {


    var token;
    if (req.headers['x-access-token']) {
        token = req.headers['x-access-token']
    }
    if (req.headers['authorization']) {
        token = req.headers['authorization']
    }
    if (req.headers['token']) {
        token = req.headers['token'];
    }
    if (req.query.token) {
        token = req.query.token
    }

    if (token) {
        jwt.verify(token, config.jwtSecret, function (err, decoded) {
            if (err) {
                return next(err);
            }
            console.log('decoded value is ', decoded);
            UserModel.findById(decoded.id).exec(function (err, user) {
                if (err) {
                    return next(err);
                }
                if (user) {
                    req.loggedInUser = user;
                    return next();
                } else {
                    next({
                        message: 'User has been removed form system', status: 404
                    });
                }
            });
        });
    } else {
        next({
            message: 'Token Not Provided',
            status: 403
        })
    }
}