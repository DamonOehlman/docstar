var docstar = require('../docstar'),
    events = require('events'),
    debug = require('debug')('docstar'),
    pkginfo = require('pkginfo'),
    path = require('path'),
    util = require('util'),
    out = require('out');
    
function ConfigHelper() {
    
};

ConfigHelper.prototype.create = function(docstar, repl) {
    var helper = this;
    
    path.exists(docstar.getConfigPath(), function(exists) {
        // TODO: if the file exists, check that the user wants to overwrite
        if (exists) {
            out('!{red}There is an existing configuration, please remove before attempting to create a new config.');
            return;
        }
        
        repl.generator.copy(
            'assets/config',
            docstar.path,
            function() {
                // now call the update method
                helper.sync(docstar, scaffolder);
            }
        );
    });
};

ConfigHelper.prototype.sync = function(docstar, repl) {
    var data = pkginfo.read(null, path.resolve('package.json'))['package'];
    
    if (data) {
        docstar.tweakConfig({
            copyright: (new Date().getFullYear()) + ', ' + data.author,
            project: data.name,
            version: data.version
        });
    }
    
    repl.run('quit');
};

module.exports = function(action) {
    var repl = this;
    
    docstar.init(function(err, instance) {
        if (err) {
            out(err);
        }
        else {
            // create the config helper
            var helper = new ConfigHelper();
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, instance, repl);
            }
            else {
                out('Do not know how to \'config ' + action + '\'');
            }
        }
    });
};