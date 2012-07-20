var events = require('events'),
    debug = require('debug')('docstar'),
    pkginfo = require('pkginfo'),
    path = require('path'),
    util = require('util'),
    _ = require('underscore'),
    repoTypes = {
        github: {
            regex: /^(?:git|https?)\:\/\/github.com\/(\w+)\/(.*)\.git$/,
            replace: 'https://github.com/$1/$2'
        }
    };
    
function _findRepositoryLocation(url) {
    var data = {};
    
    // iterate through the different repo type keys
    for (var key in repoTypes) {
        if (repoTypes[key].regex.test(url)) {
            data.repourl = url.replace(repoTypes[key].regex, repoTypes[key].replace);
        }
    }
    
    return data;
}
    
function ConfigHelper() {
    
};

ConfigHelper.prototype.create = function(docstar, scaffolder) {
    var helper = this;
    
    path.exists(docstar.getConfigPath(), function(exists) {
        // TODO: if the file exists, check that the user wants to overwrite
        if (exists) {
            scaffolder.out('!{red}There is an existing configuration, please remove before attempting to create a new config.');
            return;
        }
        
        scaffolder.copy(
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
    var data = pkginfo.read(null, path.resolve('package.json'))['package'],
        repoData = {};
        
    if (data) {
        // initialise the repo location
        if (data.repository && data.repository.url) {
            repoData = _findRepositoryLocation(data.repository.url);
        }
        
        docstar.tweakConfig(_.extend({
            copyright: (new Date().getFullYear()) + ', ' + data.author,
            project: data.name,
            version: data.version
        }, repoData));
    }
};

// action description
exports.desc = 'Synchronize the sphinx conf.py with the package.json file';

exports.args = {
};

// export runner
exports.run = function(opts, callback) {
    var scaffolder = this,
        action = opts.argv.remain[0];
    
    require('../docstar').init(function(err, instance) {
        if (err) {
            out(err);
        }
        else {
            // create the config helper
            var helper = new ConfigHelper();
            
            // if the config helper supports the action, then call it
            if (typeof helper[action] == 'function') {
                helper[action].call(helper, instance, scaffolder);
            }
            else {
                out('Do not know how to \'config ' + action + '\'');
            }
        }
    });
};