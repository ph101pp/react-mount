var through2 = require('through2')
var from = require('new-from')
var bl = require('bl')

module.exports = createStream

function createStream(transform) {
  return through2.obj(write, flush)

  function write(file, _, next) {
    if (file.isNull()) return this.push(file), next()

    var output = transform(file.path)
    var contents = file.contents
    var stream = this

    if (file.isStream()) {
      file.contents.pipe(output)
      file.contents.on('error', stream.emit.bind(stream, 'error'))
      file.contents = output
      this.push(file)
      return next()
    }

    from([contents])
      .pipe(output)
      .pipe(bl(function(err, buffer) {
        if (err) return stream.emit('error', err)
        file.contents = buffer
        stream.push(file)
        next()
      }))
  }

  function flush() {
    this.push(null)
    this.emit('end')
  }
}
