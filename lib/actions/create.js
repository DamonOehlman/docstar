var docstar = require('../docstar'),
    mkdirp = require('mkdirp'),
    path = require('path');

module.exports = function(opts, callback) {
    var scaffolder = this;
    
    docstar.init(opts, function(err, instance) {
        if (err) {
            scaffolder.out(err);
        }
        else {
            path.exists(path.join(instance.path, 'conf.py'), function(exists) {
                if (! exists) {
                    scaffolder.copyAssets(
                        'docs', 
                        function() {
                            callback(instance);
                        },
                        instance.path
                    );
                }
                else {
                    callback(instance);
                }
            });
        }
    });
};