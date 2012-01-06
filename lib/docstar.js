var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('docstar'),
    miniglob = require('miniglob'),
    SPHINX_CONFIG_FILE = 'conf.py';

function DocStar(docpath, opts) {
    this.path = path.join(opts.targetPath, docpath || 'docs');
    debug('docpath set to ' + this.path);
};

DocStar.prototype.getConfigPath = function() {
    return path.join(this.path, SPHINX_CONFIG_FILE);
};

DocStar.prototype.readConfig = function(callback) {
    fs.readFile(this.getConfigPath(), 'utf8', callback);
};

DocStar.prototype.writeConfig = function(data, callback) {
    fs.writeFile(this.getConfigPath(), data, 'utf8', callback);
};

exports.init = function(opts, callback) {
    var pattern = '**/' + SPHINX_CONFIG_FILE;
    
    miniglob(pattern, { cwd: opts.targetPath }, function(err, matches) {
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