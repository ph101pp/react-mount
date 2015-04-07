var through2 = require('through2')
var map = require('map-stream')
var Stream = require('stream')
var transform = require('./')
var File = require('vinyl')
var test = require('tape')
var fs = require('fs')
var bl = require('bl')

function noTransform() {
  return through2()
}

function uppercase() {
  return map(function(chunk, next) {
    return next(null, new Buffer(String(chunk).toUpperCase()))
  })
}

function offset(n) {
  n = n || 1

  return function() {
    return map(function(chunk, next) {
      var output = ''
      chunk = String(chunk)

      for (var i = 0; i < chunk.length; i++) {
        output += String.fromCharCode(
          chunk[i].charCodeAt(0) + n
        )
      }

      next(null, new Buffer(output))
    })
  }
}

test('null streams are just passed on', function(t) {
  t.plan(1)

  var file = new File({
    contents: null
  })

  var stream = transform(function(string) {
    t.fail('should not get called')
  })

  stream.once('end', function() {
    t.pass('no null streams were passed on')
    t.end()
  }).end(file)
})

test('buffer streams output a buffer', function(t) {
  var contents = fs.readFileSync(__filename)
  var file = new File({
    contents: contents
  })

  var stream = transform(noTransform)

  stream.once('end', function() {
    t.end()
  }).on('data', function(file) {
    t.ok(Buffer.isBuffer(file.contents), 'file.contents is a Buffer')
  }).end(file)
})

test('stream streams output a stream', function(t) {
  var contents = fs.createReadStream(__filename)
  var file = new File({ contents: contents })

  transform(noTransform).once('end', function() {
    t.end()
  }).on('data', function(file) {
    t.ok(file.contents instanceof Stream, 'file.contents is a stream')
  }).end(file)
})

test('modifying buffer streams', function(t) {
  var contents = fs.readFileSync(__filename)
  var file = new File({ contents: contents })
  var stream = transform(uppercase)

  stream.once('end', function() {
    t.end()
  }).on('data', function(file) {
    t.equal(
        String(file.contents)
      , String(contents).toUpperCase()
      , 'transforms buffer using transform stream'
    )
  }).end(file)
})

test('modifying stream streams', function(t) {
  t.plan(3)

  var contents = fs.createReadStream(__filename)
  var file = new File({ contents: contents })

  transform(uppercase).on('data', function(file) {
    file.contents.pipe(bl(function(err, buffer1) {
      t.ifError(err, 'buffered output stream without errors')

      fs.createReadStream(__filename)
        .pipe(uppercase())
        .pipe(bl(function(err, buffer2) {
          t.ifError(err, 'buffered output stream without errors')
          t.equal(
              String(buffer1)
            , String(buffer2)
            , 'transformed buffers are equal'
          )
        }))
    }))
  }).end(file)
})

test('multiple buffers in a pipeline', function(t) {
  t.plan(8)

  var contents = fs.readFileSync(__filename)
  var file = new File({ contents: contents })

  var stream = createStream()
  function createStream() {
    return transform(offset(3)).on('data', function(data) {
      t.ok(Buffer.isBuffer(file.contents), 'file.contents is still a Buffer')
    })
  }

  stream
    .pipe(createStream())
    .pipe(createStream())
    .pipe(createStream())
    .once('data', function(file) {
      fs.createReadStream(__filename)
        .pipe(offset(3)(__filename))
        .pipe(offset(3)(__filename))
        .pipe(offset(3)(__filename))
        .pipe(offset(3)(__filename))
        .pipe(bl(function(err, buffer) {
          t.ifError(err, 'buffered comparison stream without errors')
          t.notEqual(
              String(file.contents)
            , fs.readFileSync(__filename, 'utf8')
            , 'transformed output'
          )
          t.equal(
              String(file.contents)
            , String(buffer)
            , 'matching output'
          )
        }))
    })
    .once('end', function() {
      t.pass('reached stream "end" event')
    })

  stream.end(file)
})

test('multiple streams in a pipeline', function(t) {
  t.plan(9)

  var contents = fs.createReadStream(__filename)
  var file = new File({ contents: contents })

  var stream = createStream()
  function createStream() {
    return transform(offset(3)).on('data', function(data) {
      t.ok(file.contents instanceof Stream, 'file.contents is still a stream')
    })
  }

  stream
    .pipe(createStream())
    .pipe(createStream())
    .pipe(createStream())
    .once('data', function(file) {
      file.contents.pipe(bl(function(err, buffer2) {
        t.ifError(err, 'buffered output stream without errors')

        fs.createReadStream(__filename)
          .pipe(offset(3)(__filename))
          .pipe(offset(3)(__filename))
          .pipe(offset(3)(__filename))
          .pipe(offset(3)(__filename))
          .pipe(bl(function(err, buffer1) {
            t.ifError(err, 'buffered comparison stream without errors')
            t.notEqual(
                String(buffer2)
              , fs.readFileSync(__filename, 'utf8')
              , 'transformed output'
            )
            t.equal(
                String(buffer1)
              , String(buffer2)
              , 'matching output'
            )
          }))
      }))
    })
    .once('end', function() {
      t.pass('reached stream "end" event')
    })

  stream.end(file)
})
