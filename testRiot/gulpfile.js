var pkg          = require('./package.json');
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var rename       = require('gulp-rename');
var _browserify  = require('browserify');
var shim         = require('browserify-shim');
var transform    = require('vinyl-transform');
var nodemon      = require('gulp-nodemon');
var jeditor      = require('gulp-json-editor');
var react        = require('gulp-riot');

///////////////////////////////////////////////////////////////////////////////

gulp.task("default", ["watch"]);
gulp.task("scripts", scripts);
gulp.task("watch", watch);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function browserify(){
  return transform(function(filename){
    var b =  _browserify(filename);
    return b.bundle();
  });
}


///////////////////////////////////////////////////////////////////////////////

// function start(){
//   nodemon({
//     "script": "./Server/server.js",
//     "ext": "js html css",
//     "watch": ["Server/*"]
//   });
// }

///////////////////////////////////////////////////////////////////////////////

///////////////////////////////////////////////////////////////////////////////

function scripts(){
  gulp.src("./js/app.js")
    .pipe(browserify())
    .pipe(rename("bundle.js"))
    .pipe(gulp.dest("./"));
}

///////////////////////////////////////////////////////////////////////////////

function watch(){
  gulp.watch(["./js/**/*.js", "./js/tags/**/*.tag"], ['scripts']);
}

