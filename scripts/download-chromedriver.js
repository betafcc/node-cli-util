const {join} = require('path');
const {Transform} = require('stream');
const {createWriteStream} = require('fs');

const {Parse:unzipParse} = require('unzip-stream');


const main = async () =>
  downloadAndUnzip(
    await lastVersionUrl(),
    'chromedriver',
    join(process.cwd(), 'node_modules', '.bin'),
  );


const lastVersionUrl = async () => {
  const version = await fetch('https://chromedriver.storage.googleapis.com/LATEST_RELEASE');
  const os = {
    linux: 'linux',
    darwin: 'mac',
    win32: 'win',

  }[process.platform];
  const arch = process.arch.slice(1);

  return `https://chromedriver.storage.googleapis.com/${version}/chromedriver_${os}${arch}.zip`;
};



const downloadAndUnzip = async (url, fileToUnzip, destFolder) => {
  console.log(`\n\n\nDownloading chromedriver from: ${url}\n\n\n`);

  return (await new Promise(resolve => get(url, resolve)))
    .pipe(unzipParse())
    .pipe(new Transform({
      objectMode: true,

      transform(entry, encoding, next) {
        if (entry.path === fileToUnzip)
          entry
            .pipe(createWriteStream(join(destFolder, fileToUnzip), {mode: 0o755}))
            .on('finish', next);
        else {
          entry.autodrain();
          next();
        }
      }
    }));
};


const get = (url, ...args) =>
  require(url.match(/^https?/)[0])
    .get(url, ...args);


const fetch = url => new Promise(resolve => get(url, res => {
  let acc = '';
  res
    .on('data', chunk => acc += chunk)
    .on('end', _ => resolve(acc));
}));


main()
  .catch(err => console.error(err));
