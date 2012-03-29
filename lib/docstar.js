var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('docstar'),
    glob = require('glob'),
    SPHINX_CONFIG_FILE = 'conf.py',
    tweakRegexes = {
        copyright: /^(copyright).*/m,
        project: /^(project).*/m,
        theme: /^(html_theme).*/m,
        version: /^(version|release).*/mg
    },
    unicodeSections = {
        copyright: true,
        project: true
    };

function DocStar(docpath) {
    this.path = path.resolve(docpath || 'docs');
    debug('docpath set to ' + this.path);
};

DocStar.prototype.getConfigPath = function() {
    return path.join(this.path, SPHINX_CONFIG_FILE);
};

DocStar.prototype.readConfig = function(callback) {
    fs.readFile(this.getConfigPath(), 'utf8', callback);
};

DocStar.prototype.tweakConfig = function(updates, callback) {
    var docstar = this;
    
    this.readConfig(function(err, config) {
        if (err) {
            if (callback) {
                callback(err);
            }
            
            return;
        }
        
        // iterate through the updates
        Object.keys(updates).forEach(function(key) {
            // get the regex
            var regex = tweakRegexes[key],
                replaceStr = '$1 = ' + (unicodeSections[key] ? 'u' : '') + '\'' + updates[key] + '\'';
        
            // if we don't have the regex, then report an error
            if (regex) {
                config = config.replace(regex, replaceStr);
            }
        });
        
        // write the config
        docstar.writeConfig(config, callback);
    });
};

DocStar.prototype.writeConfig = function(data, callback) {
	var configPath = this.getConfigPath();
	
    fs.writeFile(configPath, data, 'utf8', function(err) {
		debug('updated config file: ' + configPath + (err ? ', err: ' + err : ''));
		
		if (callback) {
			callback(err);
		}
	});
};

exports.init = function(callback) {
    var pattern = '**/' + SPHINX_CONFIG_FILE;
    
    glob(pattern, function(err, matches) {
        // iterate through the matches and filter out those in the node_modules
        // and assets directories
        matches = matches.filter(function(matchPath) {
            return !matchPath.match(/^assets/) && !matchPath.match(/^node_modules/);
        });

        if (matches.length <= 1) {
            callback(null, new DocStar(matches[0] ? path.dirname(matches[0]) : ''));
        }
        else {
            callback('Too many possible documentation directories, please review');
        }
    });
};