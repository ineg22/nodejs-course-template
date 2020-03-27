const argv = require('minimist')(process.argv.slice(2));
const { promisify } = require('util');
const stream = require('stream');
const path = require('path');
const fs = require('fs');

const ALPHABET = 'abcdefghijklmnopqrstuvwxyz';
const defaultInputPath = path.join(__dirname, 'input.txt');
// const defaultOutputPath = path.join(__dirname, 'output.txt');

const pipeline = promisify(stream.pipeline);

const caesarShift = (char, count = 7) => {
  const inLower = ALPHABET.includes(char);
  const inUpper = ALPHABET.toUpperCase().includes(char);
  const target = inLower ? ALPHABET : ALPHABET.toUpperCase();

  if (inLower || inUpper) {
    const newIndex =
      target.indexOf(char) + count >= target.length
        ? target.indexOf(char) + count - target.length
        : target.indexOf(char) + count;
    return target[newIndex];
  }
  return char;
};

const myTransform = new stream.Transform({
  transform(chunk, encoding, callback) {
    try {
      const resultString = chunk
        .toString('utf8')
        .split('')
        .map(el => caesarShift(el))
        .join('');

      return callback(null, resultString);
    } catch (err) {
      return callback(err);
    }
  }
});

async function run() {
  await pipeline(
    fs.createReadStream(defaultInputPath),
    myTransform,
    process.stdout
    // fs.createWriteStream(defaultOutputPath)
  );

  console.log('Pipeline succeeded.');
}

run().catch(console.error);

console.log(argv);
