var docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    path = require('path'),
    util = require('util');
    
function ConfigHelper() {
    
};

ConfigHelper.prototype.create = function(docstar, scaffolder) {
    var helper = this;
    
    path.exists(docstar.getConfigPath(), function(exists) {
        // TODO: if the file exists, check that the user wants to overwrite
        if (exists) {
            scaffolder.error('There is an existing configuration, please remove before attempting to create a new config.');
        }
        
        scaffolder.copyAssets(
            'config', 
            function() {
                // now call the update method
                helper.update(docstar, scaffolder);
            },
            docstar.path
        );
    });
};

ConfigHelper.prototype.sync = function(docstar, scaffolder) {
    scaffolder.loadPackageData(function(err, data) {
        if (! err) {
            docstar.tweakConfig({
                copyright: (new Date().getFullYear()) + ', ' + data.author,
                project: data.name,
                version: data.version
            });
        }
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
            var helper = new ConfigHelper(),
                action = extraArgs[0];
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, instance, scaffolder);
            }
            else {
                scaffolder.out('Do not know how to \'config ' + action + '\'');
            }
        }
    });
};