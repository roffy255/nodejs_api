var express = require("express");
var router = express.Router();
var ProductModel = require('./../components/products/models/product.model');
var multer = require('multer');
var fs = require('fs');
var ev = require('./../events');

// var upload = multer({
//     dest: './files/images'
// });
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

function fileFilter(req, file, cb) {
    if (file.mimetype == 'image/jpeg' || file.mimetype == "image/jpg" || file.mimetype == "image/png" || file.mimetype == 'image/gif') {
        cb(null, true)
    } else {
        req.invalidFile = true;
        cb(null, false)
    }
}

var upload = multer({
    storage: storage,
    // fileFilter: fileFilter
})


function map_product_req(product, productDetails) {
    if (productDetails.name)
        product.name = productDetails.name;
    if (productDetails.category)
        product.category = productDetails.category;
    if (productDetails.brand)
        product.brand = productDetails.brand;
    if (productDetails.description)
        product.description = productDetails.description;
    if (productDetails.quantity)
        product.quantity = productDetails.quantity;
    if (productDetails.price)
        product.price = productDetails.price;
    if (productDetails.size)
        product.size = productDetails.size;
    if (productDetails.color)
        product.color = productDetails.color;
    if (productDetails.weight)
        product.weight = productDetails.weight;
    if (productDetails.manuDate)
        product.manuDate = new Date(productDetails.manuDate);
    if (productDetails.expiryDate)
        product.expiryDate = new Date(productDetails.expiryDate);
    if (productDetails.origin)
        product.origin = productDetails.origin;
    if (productDetails.modelNo)
        product.modelNo = productDetails.modelNo;
    if (productDetails.quality)
        product.quality = productDetails.quality;
    if (productDetails.status)
        product.status = productDetails.status;
    if (productDetails.batchNo)
        product.batchNo = productDetails.batchNo;
    if (productDetails.targetedGroup)
        product.targetedGroup = productDetails.targetedGroup;
    if (productDetails.image)
        product.image = productDetails.image;
    if (productDetails.tags)
        product.tags = productDetails.tags.split(',');

    return product;
}


module.exports = function () {
    // console.log('arg', arg);
    router.route('/')
        .get(function (req, res, next) {
            var condition = {};
            if (req.loggedInUser.role !== 1) {
                condition.user = req.loggedInUser._id
            }
            ProductModel.find(condition)
                .sort({
                    _id: -1
                })
                .exec(function (err, products) {
                    if (err) {
                        return next(err);
                    }
                    ev.emit('products', products);
                    res.status(200).json(products);
                });

            //aggregation

            // ProductModel.aggregate([
            //     {
            //         $match: condition
            //     },
            //     {
            //         $sort: {
            //             _id: -1
            //         }
            //     },
            //     // {
            //     //     $project: {
            //     //         category: 1,
            //     //         user: 1,
            //     //         name: 1
            //     //     }
            //     // },
            //     // {
            //     //     $lookup: {
            //     //         from: 'users',
            //     //         localField: 'user',
            //     //         foreignField: '_id',
            //     //         as: 'data'
            //     //     }
            //     // },
            //     {
            //         $group: {
            //             _id: {
            //                 month: {
            //                     $month: '$createdAt',

            //                 },
            //                 day: { $dayOfMonth: '$createdAt' },
            //                 year: { $year: '$createdAt' }
            //                 // color: '$color'
            //             },
            //             data: { $push: '$$ROOT' },
            //             count: { $sum: 1 }
            //         }
            //     },
            //     // {
            //     //     $unwind: "$tags"
            //     // }

            // ], function (err, results) {
            //     if (err) {
            //         return next(err);
            //     }
            //     res.json(results);
            // });
        })

        .post(upload.single('image'), function (req, res, next) {
            console.log('req.body data', req.body);
            console.log('req.file data', req.file);
            // if (req.invalidFile) {
            //     next({
            //         message: 'invalid file format',
            //         status: 400
            //     })
            // }
            if (req.file) {
                var fileFormat = req.file.mimetype.split('/')[0];
                console.log('fileFormat value is ', fileFormat);
                if (fileFormat !== 'image') {
                    fs.unlink('./files/images/' + req.file.filename);
                    next({
                        message: 'invalid file format',
                        status: 400
                    })
                    return;
                }
            }
            var newProduct = new ProductModel({});
            var mappedProduct = map_product_req(newProduct, req.body);
            mappedProduct.user = req.loggedInUser._id;
            if (req.file) {
                mappedProduct.image = req.file.filename;
            }

            mappedProduct.save(function (err, success) {
                if (err) {
                    return next(err);
                }
                res.status(200);
                res.json(success);
            })
        });
    router.route('/search')
        .get(function (req, res, next) {
            console.log('req.query', req.query);
            var condition = {};
            var searchQuery = map_product_req(condition, req.query);
            console.log('searchQuery>>>>', searchQuery);
            ProductModel.find(searchQuery).exec(function (err, products) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(products);
            });
        })
        .post(function (req, res, next) {
            var cond = {};
            var searchCondition = map_product_req(cond, req.body);
            if (req.body.minPrice) {
                searchCondition.price = {
                    $gte: req.body.minPrice
                }
            }
            if (req.body.maxPrice) {
                searchCondition.price = {
                    $lte: req.body.maxPrice
                }
            }
            if (req.body.minPrice && req.body.maxPrice) {
                searchCondition.price = {
                    $gte: req.body.minPrice,
                    $lte: req.body.maxPrice
                }
            }

            if (req.body.fromDate && req.body.toDate) {
                var fromDate = new Date(req.body.fromDate).setHours(0, 0, 0, 0);
                var toDate = new Date(req.body.toDate).setHours(11, 59, 0, 0);
                searchCondition.createdAt = {
                    $gte: new Date(fromDate),
                    $lte: new Date(toDate)
                }

            }
            if (req.body.tags) {
                var tagsArr = req.body.tags.split(',');
                searchCondition.tags = {
                    $in: tagsArr
                }
            }
            console.log('search condition >>', searchCondition);
            ProductModel.find(searchCondition).exec(function (err, products) {
                if (err) {
                    return next(err);
                }
                res.status(200).json(products);
            });
        })
    router.route('/:id')
        .get(function (req, res, next) {
            ProductModel.findOne({
                _id: req.params.id
            }).exec(function (err, product) {
                if (err) {
                    return next(err);
                }
                if (product) {
                    res.status(200).json(product);
                } else {
                    next({
                        message: 'Product not found',
                        status: 404
                    });
                }
            });
        })
        .put(upload.single('image'), function (req, res, next) {
            console.log('file is r', req.file);
            ProductModel.findOne({
                _id: req.params.id
            }).exec(function (err, product) {
                if (err) {
                    return next(err);
                }
                if (product) {
                    var oldImage = product.image;
                    var updatedMappedProduct = map_product_req(product, req.body);

                    if (req.file) {
                        updatedMappedProduct.image = req.file.filename

                        // validate
                        var fileFormat = req.file.mimetype.split('/')[0];
                        console.log('fileFormat value is ', fileFormat);
                        if (fileFormat !== 'image') {
                            fs.unlink('./files/images/' + req.file.filename);
                            next({
                                message: 'invalid file format',
                                status: 400
                            })
                            return;
                        }

                    }
                    updatedMappedProduct.save(function (err, udpated) {
                        if (err) {
                            return next(err);
                        }
                        if (req.file) {
                            fs.unlink('./files/images/' + oldImage);
                        }
                        res.status(200).json(udpated);
                    })

                } else {
                    next({
                        message: 'Product not found',
                        status: 404
                    });
                }
            });
        })
        .delete(function (req, res, next) {
            ProductModel.findOne({
                _id: req.params.id
            }).exec(function (err, product) {
                if (err) {
                    return next(err);
                }
                if (product) {
                    product.remove(function (err, removed) {
                        if (err) {
                            return next(err);
                        }
                        res.status(200).json(removed);
                    })
                } else {
                    next({
                        message: 'Product not found',
                        status: 404
                    });
                }
            });
        });







    return router;
}