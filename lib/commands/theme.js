var async = require('async'),
    events = require('events'),
    debug = require('debug')('docstar'),
    scaffolder = require('scaffolder'),
    path = require('path'),
    util = require('util');
    
function ThemeHelper() {
}

ThemeHelper.prototype.use = function(docstar, scaffolder, extraArgs) {
    var theme = extraArgs[0],
        helper = this;
    
    if (! theme) {
        docstar.error('No theme specified, could not install');
    }
    
    debug('copying theme to : ' + path.join(docstar.path, '_theme/' + theme));
    
    async.series([
        scaffolder.copy.bind(scaffolder, 'assets/themes/' + theme, path.join(docstar.path, '_theme/' + theme)),
        docstar.tweakConfig.bind(docstar, { theme: theme })
    ], 
    function(err) {
        if (err) {
            docstar.error(err);
        }
    });
};

// action description
exports.desc = 'Docstar theme tools';

exports.args = {
};

// export runner
exports.run = function(opts, callback) {
    var scaffolder = this,
        action = opts.argv.remain[0] || 'use';
        
    require('../docstar').init(function(err, docstar) {
        if (err) {
            throw err;
        }
        else {
            // create the config helper
            var helper = new ThemeHelper();
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, docstar, scaffolder, opts.argv.remain.slice(1));
            }
            else {
                scaffolder.out('Do not know how to \'theme ' + action + '\'');
            }
        }
    });
};