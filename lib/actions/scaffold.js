var events = require('events'),
    debug = require('debug')('docstar'),
    path = require('path'),
    util = require('util'),
    out = require('out');
    
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

module.exports = function() {
    var cli = this;
    
    require('../docstar').init(function(err, docstar) {
        if (err) {
            out('!{red}{0}', err);
        }
        else {
            docstar.scaffolder.copy('docs', docstar.path, function() {
                cli.run('quit');
            });
        }
    });
};