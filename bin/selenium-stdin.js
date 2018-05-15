#!/usr/bin/env node
const split2 = require('split2');
const {Builder} = require('selenium-webdriver');
const {join} = require('path');


// Puts chromedriver in PATH
process.env.PATH =  join(__dirname, '..', 'node_modules', '.bin') + ':' + process.env.PATH;

const [url='https://www.google.com'] = process.argv.slice(2);


new Builder().forBrowser('chrome').build().then(async (browser) => {
  await browser.get(url);

  process
    .stdin
    .pipe(split2())
    .on('data', async (command) => {
      if (!!command.match(/^\s*http/)) {
        console.log(`Navigating to ${command}`);
        await browser.get(command);
      }
      else if (!!command.match(/\s*refresh\s*/g)) {
        console.log('Refreshing...');
        (await browser.navigate()).refresh();
      }
    });
});
