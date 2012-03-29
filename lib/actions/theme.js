var async = require('async'),
    docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    scaffolder = require('scaffolder'),
    path = require('path'),
    util = require('util'),
    out = require('out');
    
function ThemeHelper() {
    
};

ThemeHelper.prototype.use = function(ds, cli, extraArgs) {
    var theme = extraArgs[0],
        helper = this;
    
    if (! theme) {
        docstar.error('No theme specified, could not install');
    }
    
    debug('copying theme to : ' + path.join(ds.path, '_theme/' + theme));
    
    async.series([
        ds.scaffolder.copy.bind(ds.scaffolder, 'themes/' + theme, path.join(ds.path, '_theme/' + theme)),
        ds.tweakConfig.bind(ds, { theme: theme })
    ], cli.run.bind(cli, 'quit'));
};

module.exports = function(input) {
    var cli = this,
        extraArgs = (input || '').split(/\s/),
        action = extraArgs[0] || 'use';
        
    docstar.init(function(err, instance) {
        if (err) {
            docstar.error(err);
        }
        else {
            // create the config helper
            var helper = new ThemeHelper();
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, instance, cli, extraArgs.slice(1));
            }
            else {
                out('Do not know how to \'theme ' + action + '\'');
            }
        }
    });
};