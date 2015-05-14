var pkg          = require('./package.json');
var gulp         = require('gulp');
var uglify       = require('gulp-uglify');
var jshint       = require('gulp-jshint');
var rename       = require('gulp-rename');
var _browserify  = require('browserify');
var transform    = require('vinyl-transform');
var childProcess = require('child_process');
var git          = require('gulp-git');
var bump         = require('gulp-bump');

///////////////////////////////////////////////////////////////////////////////

var remote       = "origin";
var branch       = "master";

///////////////////////////////////////////////////////////////////////////////

gulp.task("basic-precompiled", basicPrecompiled);
gulp.task("bumpMajor", bumpMajor);
gulp.task("bumpMinor", bumpMinor);
gulp.task("bumpPatch", bumpPatch);
gulp.task("default", ["scripts"]);
gulp.task("tag", tag);
gulp.task("deploy", deploy);
gulp.task("deployMajor", ["bumpMajor", "tag", "deploy"]);
gulp.task("deployMinor", ["bumpMinor", "tag", "deploy"]);
gulp.task("deployPatch", ["bumpPatch", "tag", "deploy"]);
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

function bumpMajor() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type:"major"}))
    .pipe(gulp.dest('./'));
}

///////////////////////////////////////////////////////////////////////////////

function bumpMinor() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump({type:"minor"}))
    .pipe(gulp.dest('./'));
}

///////////////////////////////////////////////////////////////////////////////

function bumpPatch() {
  return gulp.src(['./package.json', './bower.json'])
    .pipe(bump())
    .pipe(gulp.dest('./'));
}

///////////////////////////////////////////////////////////////////////////////

function deploy(done) {
  childProcess.spawn('npm', ['publish'], { stdio: 'inherit' })
    .on('close', done);
}

///////////////////////////////////////////////////////////////////////////////

function reactBootstrapBrowserify(){
  gulp.src("./examples/react-bootstrap-browserify/app.js")
    .pipe(browserify())
    .pipe(uglify())
    .pipe(rename("browserified.js"))
    .pipe(gulp.dest("./examples/react-bootstrap-browserify"));
}

///////////////////////////////////////////////////////////////////////////////

function tag() {
  var v = 'v' + pkg.version;
  var message = 'Release ' + v;

  return gulp.src(["./package.json", "./bower.json"])
    .pipe(git.commit(message))
    .pipe(git.tag(v, message))
    ;
    // .pipe(git.push(remote, branch, {args: '--tags'}))
}

