#!/usr/bin/env node
const {EOL} = require('os');
const split2 = require('split2');


let regexp  = process.argv[2];
try {
  regexp = eval(regexp);
} catch (e) {
  if (!(e instanceof SyntaxError || e instanceof ReferenceError))
    throw e;

  regexp = eval('`' + regexp + '`');
}

const newSubStr = eval('`' + process.argv[3] + '`');


process
  .stdin
  .pipe(split2())
  .on('data', line =>
    process
      .stdout
      .write(
        (line.toString() + EOL).replace(regexp, newSubStr)
      )
  );
