var gulp         = require('gulp');
var rename       = require('gulp-rename');
var uglify       = require('gulp-uglify');
var _browserify  = require('browserify');
var transform    = require('vinyl-transform');

///////////////////////////////////////////////////////////////////////////////

gulp.task("default", ["scripts"]);
gulp.task("scripts", scripts);

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
  gulp.src("app.js")
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename("react-bootstrap-mounted.js"))
    .pipe(gulp.dest("./"));
}
