var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var userSchema = new Schema({
    name: {
        type: String,
        uppercase: true
    },

    email: {
        type: String,
        unique: true,
        sparse: true,
        trim: true
    },
    username: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    password: {
        type: String,
        required: true
    },
    address: {
        temporaryAddress: String,
        permanentAddress: String
    },
    phone: {
        type: Number
    },
    activeUser: {
        type: Boolean,
        default: false
    },
    hobbies: [String],
    dob: Date,
    gender: {
        type: String,
        enum: ['male', 'female']
    },
    role: {
        type: Number,
        enum: [1, 2, 3],// 1 admin,2 normal user, 3 guest
        default: 2
    },
    resetPasswordToken: String,
    resetPasswordTokenExpiry: Date
}, {
        timestamps: true
    });
var UserModel = mongoose.model('user', userSchema);
module.exports = UserModel;

