var async = require('async'),
    events = require('events'),
    debug = require('debug')('docstar'),
    scaffolder = require('scaffolder'),
    path = require('path'),
    util = require('util'),
    out = require('out');
    
function ThemeHelper() {
    
};

ThemeHelper.prototype.use = function(docstar, cli, extraArgs) {
    var theme = extraArgs[0],
        helper = this;
    
    if (! theme) {
        docstar.error('No theme specified, could not install');
    }
    
    debug('copying theme to : ' + path.join(docstar.path, '_theme/' + theme));
    
    async.series([
        docstar.scaffolder.copy.bind(docstar.scaffolder, 'assets/themes/' + theme, path.join(docstar.path, '_theme/' + theme)),
        docstar.tweakConfig.bind(docstar, { theme: theme })
    ], 
    function(err) {
        if (err) {
            docstar.error(err);
        }
        
        cli.run('quit');
    });
};

module.exports = function(input) {
    var cli = this,
        extraArgs = (input || '').split(/\s/),
        action = extraArgs[0] || 'use';
        
    require('../docstar').init(function(err, docstar) {
        if (err) {
            throw err;
        }
        else {
            // create the config helper
            var helper = new ThemeHelper();
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, docstar, cli, extraArgs.slice(1));
            }
            else {
                out('Do not know how to \'theme ' + action + '\'');
            }
        }
    });
};