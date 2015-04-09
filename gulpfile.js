var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var rename       = require('gulp-rename');
var _browserify  = require('browserify');
var transform    = require('vinyl-transform');

///////////////////////////////////////////////////////////////////////////////

gulp.task("basic-precompiled", basicPrecompiled);
gulp.task("default", ["scripts"]);
gulp.task("react-bootstrap-browserify", reactBootstrapBrowserify);
gulp.task("scripts", ["basic-precompiled", "react-bootstrap-browserify"]);

///////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////////////////////////////////////////

function basicPrecompiled(){
  gulp.src("./examples/basic-precompiled/example.jsx")
    .pipe(browserify())
    .pipe(rename("compiled.js"))
    .pipe(gulp.dest("./examples/basic-precompiled"));

}

///////////////////////////////////////////////////////////////////////////////

function browserify(){
  return transform(function(filename){
    var b =  _browserify(filename);
    return b.bundle();
  });
}

///////////////////////////////////////////////////////////////////////////////

function reactBootstrapBrowserify(){
  gulp.src("./examples/react-bootstrap-browserify/app.js")
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename("browserified.js"))
    .pipe(gulp.dest("./examples/react-bootstrap-browserify"));
}
