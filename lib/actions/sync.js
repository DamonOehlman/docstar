var docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    path = require('path'),
    util = require('util');
    
function _sync(docstar, scaffolder, callback) {
    scaffolder.loadPackageData(function(err, data) {
        if (! err) {
            docstar.tweakConfig({
                copyright: (new Date().getFullYear()) + ', ' + data.author,
                project: data.name,
                version: data.version
            });
        }

		callback(err, data);
    });
};

module.exports = function(opts, extraArgs, callback) {
    var scaffolder = this;
    
    docstar.init(opts, function(err, instance) {
        if (err) {
            scaffolder.out(err);
        }
        else {
			_sync(instance, scaffolder, function() {
				
			});
        }
    });
};