var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var rename       = require('gulp-rename');
var _browserify  = require('browserify');
var transform    = require('vinyl-transform');

///////////////////////////////////////////////////////////////////////////////

gulp.task("default", ["scripts", "watch"]);
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

function scripts(){
  gulp.src("./test/**/app.jsx")
    .pipe(browserify())
    .pipe(rename("bundle.js"))
    // .pipe(rename(function(path){
    //   console.log(path);
    //   path.dirname+="/../";
    //   path.basename="bundle";
    //   path.extname=".js";
    // }))
    .pipe(gulp.dest("./test"));
}

///////////////////////////////////////////////////////////////////////////////

function watch(){
  gulp.watch(["./test/**/*.jsx", "./react-mount.js"], ['scripts']);
}

