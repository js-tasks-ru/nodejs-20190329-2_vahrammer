const fs = require('fs');

const ERR_413_MESS = 'Payload too large';
const ERR_500_MESS = 'Internal server error';
const LimitSizeStream = require('./LimitSizeStream');


module.exports = function(filepath, req, res) {
  const lsStream = new LimitSizeStream({limit: 1024 * 1024});
  const fwStream = fs.createWriteStream(filepath);

  req.pipe(lsStream).pipe(fwStream);

  req.on('aborted', () => removeFile());
  lsStream.on('error', () => handleError(413, ERR_413_MESS));
  fwStream.on('error', () => handleError(500, ERR_500_MESS));

  fwStream.on('finish', () => {
    res.statusCode = 201;
    res.end('Created');
  });


  function handleError(code, message) {
    removeFile();
    res.statusCode = code;
    res.end(message);
  }


  function removeFile() {
    fs.unlink(filepath, (err) => {
      if (err) {
        console.error(`Can't remove file:\n${filepath}`);
      }
    });
  }
};
