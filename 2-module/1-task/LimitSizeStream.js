const stream = require('stream');
const LimitExceededError = require('./LimitExceededError');

class LimitSizeStream extends stream.Transform {
  constructor(options) {
    super(options);
    this._limit = options.limit || 1024 ^ 2;
    this._fileSize = 0;
  }

  _transform(chunk, encoding, callback) {
    this._fileSize += chunk.length;

    if (this._fileSize > this._limit) {
      callback(new LimitExceededError());
    }

    callback(null, chunk);
  }
}

module.exports = LimitSizeStream;
