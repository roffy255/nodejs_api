// router for product components
var router = require('express').Router();
var productCtrl = require('./../controllers/product.ctrl');
var productHelper = require('./../helpers/product');

router.route('/')
    .get(productCtrl.get)
    .post(productHelper.upload.single('image'), productCtrl.insert);


router.route('/:id')
    .get(productCtrl.getById)
    .put(productHelper.upload.single('image'), productCtrl.update)
    .delete(productCtrl.remove);


module.exports = router;