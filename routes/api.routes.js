var router = require('express').Router();
// import all the routes of components here
var productRoute = require('./../components/products/routes/product.route');

module.exports = function (authenticate, authorize) {
    // configure route
    router.use('/product', authenticate, productRoute);

    return router;
}



