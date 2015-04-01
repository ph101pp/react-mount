(function() {
  var compile, gutil, through;

  gutil = require('gulp-util');

  through = require('through2');

  compile = require('riot').compile;

  module.exports = function(opts) {
    var transform;
    transform = function(file, encoding, callback) {
      var splitedPath;
      if (file.isNull()) {
        return callback(null, file);
      }
      if (file.isStream()) {
        return callback(new gutil.PluginError('gulp-article', 'Stream not supported'));
      }
      file.contents = new Buffer(compile(file.contents.toString(), opts));
      splitedPath = file.path.split('.');
      splitedPath[splitedPath.length - 1] = 'js';
      file.path = splitedPath.join('.');
      return callback(null, file);
    };
    return through.obj(transform);
  };

}).call(this);
