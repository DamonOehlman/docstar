var path = require('path');

// action description
exports.desc = 'Scaffold base docs';

exports.args = {
};

// export runner
exports.run = function(opts, callback) {
    var scaffolder = this,
        done = callback; // scaffolder.chain('config create', opts, callback);
    
    require('../docstar').init(function(err, docstar) {
        if (err) {
            scaffolder.out('!{red}{0}', err);
        }
        else {
            scaffolder.copy(path.join('assets', 'docs'), docstar.path, done);
        }
    });
};