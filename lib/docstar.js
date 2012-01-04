var fs = require('fs'),
    path = require('path'),
    fstream = require('fstream');

function _findFile(targetPath, filename, callback) {
    
    var found = false;
    
    function find(childPath, parent) {
        var reader = fstream.Reader({
            path: childPath,
            filter: function() {
                return !this.basename.match(/^\./) && !this.basename.match(/^node_modules$/);
            }
        });

        reader.on('entry', function(data) {
            if (!found && data.type === 'File' && data.basename === filename) {
                found = true;
                callback(data.path);
            }
            else if (!found && data.type === 'Directory') {
                find(data.path, reader);
            }
        });
        
        if (! parent) {
            reader.on('end', function() {
                if (! found) {
                    callback();
                }
            });
        }
    } // childPath
    
    find(targetPath);
};

exports.init = function(opts, callback) {
    // look for a directory under the target path with a directory that
    // contains a conf.py as per the readthedocs.org check
    _findFile(opts.targetPath, 'conf.py', function(folderPath) {
        console.log(folderPath);
    });
};