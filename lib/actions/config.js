var docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    path = require('path'),
    util = require('util'),
    reVersion = /^(version|release).*/mg,
    reCopyright = /^(copyright).*/m;
    
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
            'docs', 
            function() {
                // now call the update method
                helper.update(docstar, scaffolder);
            },
            docstar.path
        );
    });
};

ConfigHelper.prototype.update = function(docstar, scaffolder) {
    docstar.readConfig(function(err, config) {
        scaffolder.loadPackageData(function(pkgErr, data) {
            if (!err && !pkgErr) {
                config = config
                    // replace version strings
                    .replace(reVersion, '$1 = \'' + data.version + '\'')
                    
                    // replace copyright section
                    .replace(reCopyright, '$1 = \'' + (new Date().getFullYear()) + ', ' + data.author + '\'');
                
                // save the config
                docstar.writeConfig(config);
            }
            else {
                scaffolder.error(err);
            }
        });
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