// this file will maintain db query
const ProductModel = require("./../models/product.model");
const productHelper = require('./../helpers/product');

function get(condition) {
    return new Promise(function (reslove, reject) {
        ProductModel.find(condition).exec(function (err, products) {
            if (err) {
                reject(err);
            } else {
                reslove(products)
            }
        });
    });
}

function insert(data, cb) {
    var newProduct = new ProductModel({});
    var mappedProduct = productHelper.map(newProduct, data);
    mappedProduct.save(function (err, saved) {
        if (err) {
            cb(err);
        } else {
            cb(null, saved)
        }
    });
}

function update(id, data) {
    return new Promise(function (resolve, reject) {

        ProductModel.findById(id).exec(function (err, product) {
            if (err) {
                reject(err);
            }
            if (product) {
                var updatedMappedProduct = productHelper.map(product, data);
                updatedMappedProduct.save(function (err, updated) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(updated);
                    }
                });
            } else {
                reject({
                    message: 'product not found',
                    status: 404
                });
            }
        });
    });
}

function remove(id) {
    return new Promise(function (resolve, reject) {
        ProductModel.findById(id).exec(function (err, product) {
            if (err) {
                reject(err);
            }
            if (product) {
                product.remove(function (err, removed) {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(removed);
                    }
                });
            } else {
                reject({
                    message: 'product not found',
                    status: 404
                });
            }
        });
    });
}

module.exports = {
    get: get,
    insert: insert,
    update: update,
    remove: remove
}