// helpers method that can be used with in product component by different files


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
    if (productDetails.user)
        product.user = productDetails.user;
    if (productDetails.tags)
        product.tags = productDetails.tags.split(',');
    return product;
}


var multer = require('multer');


var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './files/images')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
})

var upload = multer({
    storage: storage,
});

module.exports = {
    map: map_product_req,
    upload: upload
}

