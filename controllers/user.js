var express = require('express');
var router = express.Router();
var mongodb = require("mongodb");
var MongoClient = mongodb.MongoClient;
var config = require('./../config');
var oid = mongodb.ObjectID;
var authorize = require('./../middlewares/authorize');
var UserModel = require('./../models/user.model');
var mapUserRequest = require('./../common/map_user_req');

router.get('/', function (req, res, next) {
    console.log('loogeed in user', req.loggedInUser);
    console.log('req.querry', req.query);
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     console.log('db connection success');
    //     var db = client.db(config.dbName);
    //     db.collection('users').find({}).toArray(function (err, users) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.status(200);
    //         res.json(users);
    //     })
    // });
    UserModel.find({})
        .sort({
            _id: -1
        })
        .skip(2)
        .limit(2)
        .exec(function (err, users) {
            if (err) {
                return next(err);
            }
            res.status(200).json(users);
        })
    console.log('i am non blocking code');
});
router.get('/:id', function (req, res, next) {
    console.log('loogeed in user', req.loggedInUser);

    console.log('req.params', req.params);//{username:'sadlkfj'}
    // res.json(req.query);
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').find({
    //         _id: new oid(req.params.id)
    //     }).toArray(function (err, user) {
    //         if (err) {
    //             return next(err);
    //         }
    //         res.status(200).json(user)
    //     })
    // })
    UserModel.findById(req.params.id).exec(function (err, done) {
        if (err) {
            return next(err);
        }
        res.status(200).json(done);
    })
})
router.put('/:id', authorize, function (req, res, next) {
    console.log('loogeed in user', req.loggedInUser);

    var id = req.params.id;
    // MongoClient.connect(config.dbUrl, function (err, client) {
    //     if (err) {
    //         return next(err);
    //     }
    //     var db = client.db(config.dbName);
    //     db.collection('users').update({
    //         _id: new oid(id)
    //     }, {
    //             $set: req.body
    //         }, function (err, done) {
    //             if (err) {
    //                 return next(err);
    //             }
    //             res.status(200).json(done);
    //         });
    // });
    UserModel.findById(id).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            // res.json(user);
            var updatedMappedUser = mapUserRequest(user, req.body);

            updatedMappedUser.save(function (err, done) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(done);
            })

        } else {
            next({ message: 'user not found', status: 404 })
        }
    })


})

router.delete('/:id', function (req, res, next) {
    console.log('loogeed in user', req.loggedInUser);

    var id = req.params.id;
    UserModel.findById(id).exec(function (err, user) {
        if (err) {
            return next(err);
        }
        if (user) {
            user.remove(function (err, removed) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(removed);
            })
        } else {
            next({
                message: "user not found",
                status: 404
            });
        }
    });
})

module.exports = router;
