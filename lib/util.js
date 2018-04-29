const {Transform} = require('stream');


const map = f => new Transform({
  objectMode: true,
  transform: (chunk, encoding, next) =>
    next(null, f(chunk))
  ,
});


const filter = f => new Transform({
  objectMode: true,
  transform: (chunk, encoding, next) =>
    f(chunk)
      ? next(null, chunk)
      : next(null)
  ,
})


const accumulate = (f, initial) => new Transform({
  objectMode: true,

  transform(chunk, encoding, next) {
    if (this.initialized)
      this.current = f(this.current, chunk);
    else {
      this.initialized = true;

      if (initial === undefined)
        this.current = chunk;
      else
        this.current = f(initial, chunk);
    }

    next(null, this.current);
  }
});


module.exports = {
  map,
  filter,
  accumulate,
};
