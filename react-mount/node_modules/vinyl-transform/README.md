# vinyl-transform [![Flattr this!](https://api.flattr.com/button/flattr-badge-large.png)](https://flattr.com/submit/auto?user_id=hughskennedy&url=http://github.com/hughsk/vinyl-transform&title=vinyl-transform&description=hughsk/vinyl-transform%20on%20GitHub&language=en_GB&tags=flattr,github,javascript&category=software)[![experimental](http://hughsk.github.io/stability-badges/dist/experimental.svg)](http://github.com/hughsk/stability-badges) #

**vinyl-transform** wraps standard text transform streams so you can
[write fewer gulp plugins](http://blog.overzealous.com/post/74121048393/why-you-shouldnt-create-a-gulp-plugin-or-how-to-stop).
Fulfills a similar use case to [vinyl-map](http://github.com/hughsk/vinyl-map)
and [vinyl-source-stream](http://github.com/hughsk/vinyl-source-stream).

This module lets you take your standard text transform streams from npm,
(e.g. [envify](http://github.com/hughsk/envify)), and use them in a
[vinyl](http://github.com/gulpjs) pipeline. It'll transparently take care of
handling both buffered and streaming vinyl instances for you too.

## Usage ##

[![vinyl-transform](https://nodei.co/npm/vinyl-transform.png?mini=true)](https://nodei.co/npm/vinyl-transform)

### `createStream(transformFn)` ###

Creates a vinyl transform stream. `transformFn(filename)` is a function which
takes the file's path and returns a text transform stream. If you've used
[browserify](http://github.com/substack/node-browserify)'s
[transform API](https://github.com/substack/node-browserify#btransformopts-tr)
you'll recognise this pattern: it's effectively the same API used here.

Here's an example of using this to... uppercase a bunch of files:

``` javascript
var transform = require('vinyl-tranform')
var map = require('map-stream')
var gulp = require('gulp')

gulp.task('uppercase', function() {
  var uppercaser = transform(function(filename) {
    return map(function(chunk, next) {
      return next(null, chunk.toString().toUpperCase())
    })
  })

  gulp.src('*.txt')
    .pipe(uppercaser)
    .pipe(gulp.dest('dist/'))
})
```

And convert `.gif` images into `.webm` videos:

``` javascript
var createGIFStream = require('gif-video')
var transform = require('vinyl-transform')
var gulp = require('gulp')

gulp.task('gif-to-webm', function() {
  gulp.src('images/*.gif')
    .pipe(transform(createGIFStream))
    .pipe(gulp.dest('dist/videos/'))
})
```

Or inject scripts into your HTML:

``` javascript
var transform = require('vinyl-transform')
var inject = require('script-injector')
var gulp = require('gulp')

gulp.task('pages', function() {
  var injector = transform(function() {
    return inject(function() {
      console.log('this script wasn\'t here before')
    })
  })

  gulp.src('*.html')
    .pipe(injector)
    .pipe(gulp.dest('dist/'))
})
```

## License ##

MIT. See [LICENSE.md](http://github.com/hughsk/vinyl-transform/blob/master/LICENSE.md) for details.
