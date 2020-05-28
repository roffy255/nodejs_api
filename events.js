var events = require('events');

var eventEmitter = new events.EventEmitter();
var eventEmitter1 = new events.EventEmitter();

// on is a method for events to listens
// emit is a method for events to trigger
setTimeout(function () {
    eventEmitter.emit('ram');
}, 3000)

eventEmitter.on('ram', function (data) {
    console.log('event fried fro ram >> ', data);
});

eventEmitter.on('products', function (data) {
    console.log('products event fired >>', data);
})

module.exports = eventEmitter1;