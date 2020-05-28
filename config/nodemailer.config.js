var nodemailer = require('nodemailer');
var sender = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: 'broadwaytest44@gmail.com', // generated ethereal user
        pass: 'Broadwaytest44!' // generated ethereal password
    }
});
module.exports = sender;