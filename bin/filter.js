#!/usr/bin/env node
const {EOL} = require('os');
const split2 = require('split2');


const f = eval(process.argv[2]);


process
  .stdin
  .pipe(split2(JSON.parse))
  .on('data', obj =>
    (!f(obj)) ? null :
      process
        .stdout
        .write(JSON.stringify(obj) + EOL)
  );
