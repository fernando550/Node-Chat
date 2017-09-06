var moment = require('moment');

var message = {};

message.generate = function(from, text){
    return {
        from,
        text,
        createdAt: moment().valueOf()
    };
};

message.geolocation = function(from, latitude, longitude){
    return {
        from,
        url: `https://www.google.com./maps?q=${latitude},${longitude}`,
        createdAt: moment().valueOf()
    };
};
module.exports = message;