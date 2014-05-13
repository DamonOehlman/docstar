var fs = require('fs'),
    path = require('path'),
    debug = require('debug')('docstar'),
    glob = require('glob'),
    SPHINX_CONFIG_FILE = 'conf.py',
    tweakRegexes = {
      copyright: /^(copyright).*/m,
      project: /^(project).*/m,
      theme: /^(html_theme).*/m,
      version: /^(version|release).*/mg,
      repourl: /^(github_url|bitbucket_url).*/mg
    },
    unicodeSections = {
      copyright: true,
      project: true
    };

/**
  # docstar

  Docstar is a collection of tools to assist with build great looking docs for
  JS libraries.  These tools are designed to help bridge the gap between
  [Sphinx](http://sphinx.pocoo.org) and current JavaScript documentation tools.

  The goal is to make documenting a library a well understood and repeatable
  process, which in turn makes it feel easier.  The result being that having
  documentation that is easier to write and maintain, improves the quality of
  documentation have a net positive effect for the whole community.

  ## Other Tools

  I have moved across to using [gendocs](https://github.com/DamonOehlman/gendocs)
  which feels like it has less overheads.  Additionally people visit documentation
  sites less than they read README files.

**/

function DocStar(docpath) {
  this.path = path.resolve(docpath || 'docs');
  debug('docpath set to ' + this.path);
};

DocStar.prototype.getConfigPath = function() {
  return path.join(this.path, SPHINX_CONFIG_FILE);
};

DocStar.prototype.readConfig = function(callback) {
  debug('attempting to read configuration from: ' + this.getConfigPath());
  fs.readFile(this.getConfigPath(), 'utf8', callback);
};

DocStar.prototype.tweakConfig = function(updates, callback) {
  var docstar = this;

  debug('attempting to tweak configuration, updates: ', updates);
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

  debug('attempting to write config update to: ' + configPath);
  fs.writeFile(configPath, data, 'utf8', function(err) {
    debug('updated config file: ' + configPath + (err ? ', err: ' + err : ''));

    if (callback) {
      callback(err);
    }
  });
};

exports.init = function(callback) {
  var pattern = '*/' + SPHINX_CONFIG_FILE;

  glob(pattern, function(err, matches) {
    // iterate through the matches and filter out those in the node_modules
    // and assets directories
    matches = matches.filter(function(matchPath) {
      return !matchPath.match(/^assets/) && !matchPath.match(/^node_modules/);
    });

    if (matches.length <= 1) {
      var docstar = new DocStar(matches[0] ? path.dirname(matches[0]) : '');

      callback(null, docstar);
    }
    else {
      debug('Found ' + matches.length + ' possible matches, cannot decide', matches);
      callback('Too many possible documentation directories, please review');
    }
  });
};
