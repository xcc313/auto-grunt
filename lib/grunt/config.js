/*
 * grunt
 * https://github.com/cowboy/grunt
 *
 * Copyright (c) 2012 "Cowboy" Ben Alman
 * Licensed under the MIT license.
 * http://benalman.com/about/license/
 */

var grunt = require('../grunt');

// The actual config data.
var data;

// Get/set config data. If data hasn't been set, return null. If value was
// passed, set value. If props string wasn't passed, return all data. Otherwise,
// return the prop's value.
var config = module.exports = function(prop, value) {
  if (arguments.length === 2) {
    // Two arguments were passed, set the property's value.
    return config.set(prop, value);
  } else {
    // Get the property's value (or the entire data object).
    return config.get(prop);
  }
};

// If prop is an array, convert it to a props string.[系统任务名称，具体的目标]=》系统任务名称.具体的目标例如concat.first
function getPropString(prop) {
  if (grunt.utils.kindOf(prop) === 'array') {
    return prop.map(config.escape).join('.');
  }
  return prop;
}
//递归项目中grunt对象配置的每个值，替换系统命令为真正的值例如  banner: <config:concat.dist.dest>这样的系统命令
// Recursively expand config directives.
function processDirectives() {
  // These directives should be processed now.
  var toProcess = ['config', 'json'];
  data = grunt.utils.recurse(data, function(value) {
    if (typeof value !== 'string') { return value; }
	//把系统任务名称标准化
    var parts = grunt.task.getDirectiveParts(value) || [];
    return toProcess.indexOf(parts[0]) !== -1 ? grunt.task.directive(value) : value;
  });
}
function processTemplate(){
  data = grunt.utils.recurse(data, function(value) {
    if (typeof value !== 'string') { return value; }
	 var template = /<%=\s*(.+?)\s*%>/.exec(value);
	 if ( template ){
		 template = grunt.config(template[1]);
		 return template;
	 } else {
		 return value;
	 }
  });
}
// Get config data.
config.get = function(prop) {
  // Abort if no config data exists.
  if (!data) { return null; }
  // If prop is an array, convert it to a prop string.
  prop = getPropString(prop);
  
  if (prop) {
    // A property string/array was passed, get that property's value.
    return grunt.utils.namespace.get(data, prop);
  } else {
    // Nothing was passed. Return a shalow clone of the actual config data.
    return grunt.utils._.clone(data);
  }
};

// Set config data.
config.set = function(prop, value) {
  // Abort if no config data exists.
  if (!data) { return null; }
  // If prop is an array, convert it to a prop string.
  prop = getPropString(prop);
  // Set the property's value.
  var result = grunt.utils.namespace.set(data, prop, value);
  // Process directives.
  processDirectives();
  // Return result.
  return result;
};

// Get config data, processing it as a template if necessary.
config.process = function(prop) {
  return grunt.utils.recurse(config.get(prop), function(value) {
    if (typeof value !== 'string') { return value; }
    return grunt.template.process(value, data);
  });
};

// Initialize config data.
config.init = function(obj) {
  grunt.verbose.write('Initializing config...').ok();
  // Initialize data.
  data = obj || {};
  // Process directives.//注意处理配置中的json,config
  processDirectives();
  //软件的bug,设置配置中有<%= 值%>
  processTemplate();
  // Return data.
  return data;
};

// Escape any . in name with \. so dot-based namespacing works properly.
config.escape = function(str) {
  return str.replace(/\./g, '\\.');
};

// Test to see if required config params have been defined. If not, throw an
// exception (use this inside of a task).
config.requires = function() {
  var p = grunt.utils.pluralize;
  var props = grunt.utils.toArray(arguments).map(getPropString);
  var msg = 'Verifying propert' + p(props.length, 'y/ies') +
    ' ' + grunt.log.wordlist(props) + ' exist' + p(props.length, 's') +
    ' in config...';
  grunt.verbose.write(msg);
  var failProps = data && props.filter(function(prop) {
    return config.get(prop) === undefined;
  }).map(function(prop) {
    return '"' + prop + '"';
  });
  if (data && failProps.length === 0) {
    grunt.verbose.ok();
    return true;
  } else {
    grunt.verbose.or.write(msg);
    grunt.log.error().error('Unable to process task.');
    if (!data) {
      throw grunt.task.taskError('Unable to load config.');
    } else {
      throw grunt.task.taskError('Required config propert' +
        p(failProps.length, 'y/ies') + ' ' + failProps.join(', ') +
        ' missing.');
    }
  }
};
