var express = require('express');

var router = express.Router();
var UserModel = require('./../models/user.model');
var mongodb = require('mongodb');
var mapRequest = require('./../common/map_user_req');
var jwt = require('jsonwebtoken');
var config = require('./../config');
var passworHash = require('password-hash');
var randomString = require('randomstring');
var mailSender = require('./../config/nodemailer.config');

function prepareMail(data) {
    var mailOptions = {
        from: 'Hamro Travel&Tours', // sender address
        to: `${data.email},bpngaire@gmail.com,aakashtha49@gmail.com,pradeep.lamkhor@gmail.com,roffy.joshi5225@gmail.com`, // list of receivers
        subject: "Forgot Password ✔", // Subject line
        text: "Hello world?", // plain text body
        html: `<div>
        <b>Hello ${data.username}</b>
        </div>
        <div>
        We noticed that you are facing trouble accessing our system,Please click int the link below to reset your password
        </div>
        <div>
        <a href="${data.link}" target="_blank">Reset Password</a></div>
        <div>Regards,</div><div>Hamro Traves&Tours Team</div>`// html body
    };
    return mailOptions;
}
var MongoClient = mongodb.MongoClient;
var config = require('./../config');

function createToken(data) {
    var token = jwt.sign({
        username: data.username,
        id: data._id,
        role: data.role
    }, config.jwtSecret, {
            expiresIn: '1h'
        });

    return token;
}

// login
router.post('/', function (req, res, next) {
    // console.log('requdst is here at post request', req.body);

    UserModel.findOne({
        $or: [{
            username: req.body.username
        }, {
            email: req.body.username
        }]
    }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            console.log('user found >>', user)
            var matched = passworHash.verify(req.body.password, user.password);
            if (matched) {
                var token = createToken(user);
                res.status(200).json({
                    user: user,
                    token: token
                });
            } else {
                next({
                    message: 'invalid login credentials',
                    status: 400
                });
            }

        } else {
            next({
                message: 'invalid login credentials',
                status: 404
            });
        }
    })

})


router.post('/register', function (req, res, next) {
    // res.render('register');
    console.log('post data here', req.body);
    //data is here now proceed with db

    var newUser = new UserModel({});
    var mappedUser = mapRequest(newUser, req.body);
    mappedUser.password = passworHash.generate(req.body.password);

    mappedUser.save(function (err, done) {
        if (err) {
            return next(err);
        }
        res.status(200).json(done);
    })
});

router.post('/forgot-password', function (req, res, next) {

    UserModel.findOne({ email: req.body.email }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            var resetToken = randomString.generate(25);
            var resetTokenExpiry = Date.now() + 1000 * 60 * 60 * 24 * 2;
            user.resetPasswordToken = resetToken;
            user.resetPasswordTokenExpiry = new Date(resetTokenExpiry);
            var username = user.username;
            var email = user.email;
            var link = req.headers.origin + '/auth/reset-password/' + resetToken
            var mailData = {
                username,
                email,
                link
            }
            var mailBody = prepareMail(mailData);
            mailSender.sendMail(mailBody, function (err, done) {
                if (err) {
                    return next(err);
                }
                user.save(function (err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                });
            });

        } else {
            next({
                message: 'Email not registered yet'
            });
        }
    });
});
router.post('/reset-password/:token', function (req, res, next) {
    var token = req.params.token;
    UserModel.findOne({ resetPasswordToken: token }).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            if (new Date(user.resetPasswordTokenExpiry).getTime() > Date.now()) {

                user.password = passworHash.generate(req.body.password);
                user.resetPasswordToken = null;
                user.resetPasswordTokenExpiry = null;
                user.save(function (err, done) {
                    if (err) {
                        return next(err);
                    }
                    res.json(done);
                })
            } else {
                next({
                    message: 'token expired'
                });
            }

        } else {
            next({
                message: 'Reset Token didnot matched'
            })
        }
    })

});




module.exports = router;