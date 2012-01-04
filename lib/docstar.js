var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('docstar'),
    miniglob = require('miniglob');

function DocStar(docpath, opts) {
    console.log(docpath);
    this.path = path.join(opts.targetPath, docpath || 'docs');
    debug('docpath set to ' + this.path);
};

exports.init = function(opts, callback) {
    var pattern = '**/conf.py';
    
    miniglob(pattern, { cwd: opts.targetPath }, function(err, matches) {
        // splice the pattern out while miniglob returns it in the matches
        var matchIndex = matches.indexOf(pattern);
        if (matchIndex >= 0) {
            matches.splice(matchIndex, 1);
        }
        
        // iterate through the matches and filter out those in the node_modules
        // and assets directories
        matches = matches.filter(function(matchPath) {
            return !matchPath.match(/^assets/) && !matchPath.match(/^node_modules/);
        });

        if (matches.length <= 1) {
            callback(null, new DocStar(matches[0] ? path.dirname(matches[0]) : '', opts));
        }
        else {
            callback('Too many possible documentation directories, please review');
        }
    });
};