var docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    path = require('path'),
    util = require('util');
    
function ThemeHelper() {
    
};

ThemeHelper.prototype.install = function(docstar, scaffolder, extraArgs) {
    var theme = extraArgs[0],
        helper = this;
    
    if (! theme) {
        scaffolder.error('No theme specified, could not install');
    }
    
    scaffolder.copyAssets(
        'themes/' + theme, 
        function() {
            // now call the update method
            helper.use(docstar, scaffolder, extraArgs);
        },
        path.join(docstar.path, '_theme/' + theme)
    );
};

ThemeHelper.prototype.use = function(docstar, scaffolder, extraArgs) {
    docstar.tweakConfig({
        // TODO: check the theme exists
        theme: extraArgs[0] || 'default'
    });
};

module.exports = function(opts, extraArgs, callback) {
    var scaffolder = this;
    
    docstar.init(opts, function(err, instance) {
        if (err) {
            scaffolder.out(err);
        }
        else {
            // create the config helper
            var helper = new ThemeHelper(),
                action = extraArgs[0];
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, instance, scaffolder, extraArgs.slice(1));
            }
            else {
                scaffolder.out('Do not know how to \'theme ' + action + '\'');
            }
        }
    });
};