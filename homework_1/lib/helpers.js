const crypto = require('crypto');
const config = require('./config');

var helpers = {};

helpers.hash = (str) => {
    if(typeof(str) == 'string' && str.length > 0) {
        var hash = crypto.createHmac('sha256', config.hashingSecret).update(str).digest('hex');
        return hash;
    } else {
        return false;
    }
};

helpers.parseJsonToObject = (str) => {
    try {
        var obj = JSON.parse(str);
        return obj;
    } catch {
        return {};
    }
};

helpers.createRandomString = (length) => {
    length = typeof(length) == 'number' && length > 0 ? length : 10;
    var posChars = 'abcdefgijklmnopqrstuwvwxyz01234567890';
    var str = '';
    for(i = 1; i <= length; i++) {
        str += posChars.charAt(Math.floor(Math.random() * posChars.length));
    }
    return str;
};

module.exports = helpers;