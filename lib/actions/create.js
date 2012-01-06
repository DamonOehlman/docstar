var docstar = require('../docstar'),
    debug = require('debug')('docstar'),
    path = require('path');

module.exports = function(opts, extraArgs, callback) {
    var scaffolder = this;
    
    docstar.init(opts, function(err, instance) {
        if (err) {
            scaffolder.out(err);
        }
        else {
        }
    });
};