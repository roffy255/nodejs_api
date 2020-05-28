var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ProductSchema = new Schema({
    name: {
        type: String
    },
    quantity: Number,
    price: Number,
    size: String,
    color: String,
    weight: String,
    expiryDate: Date,
    origin: String,
    manuDate: String,
    category: String,
    brand: String,
    modelNo: String,
    quality: {
        type: String,
        enum: ['low', 'high', 'medium'],
        default: 'high'
    },
    status: {
        type: String,
        enum: ['availabel', 'sold', 'out of order', 'out of stock'],
        default: 'availabel'
    },
    description: String,
    batchNo: Number,
    targetedGroup: String,
    image: String,
    tags:[String],
    user: {
        type: Schema.Types.ObjectId,
        ref: 'user'
    }



}, {
        timestamps: true
    });

var ProductModel = mongoose.model('product', ProductSchema);
module.exports = ProductModel;