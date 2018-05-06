#!/usr/bin/env node
const {EOL} = require('os');
const split2 = require('split2');


const f = eval(process.argv[2]);


process
  .stdin
  .pipe(split2(JSON.parse))
  .on('data', obj =>
    process
      .stdout
      .write(JSON.stringify(f(obj)) + EOL)
  );
