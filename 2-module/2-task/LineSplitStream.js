const stream = require('stream');
const os = require('os');

class LineSplitStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._line = '';
  }

  _transform(chunk, encoding, callback) {
    const chunkStr = chunk.toString();

    const hasEol = ~chunkStr.indexOf(os.EOL);
    if (!hasEol) {
      this._line += chunkStr;
      callback();
      return;
    }

    const lines = chunkStr.split(os.EOL);
    lines.forEach((line, i) => {
      switch (i) {
        case 0:
          this.push(this._line + line);
          this._line = '';
          break;

        case lines.length - 1:
          this._line = line;
          break;

        default:
          this.push(line);
      }
    });

    callback();
  }

  _flush(callback) {
    callback(null, this._line ? this._line : null);
  }
}

module.exports = LineSplitStream;
