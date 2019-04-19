const fs = require('fs');

module.exports = function(filepath, res) {
  fs.unlink(filepath, (err) => {
    if (err) {
      console.error(`Can't remove file:\n${filepath}`);
      res.statusCode = 500;
      res.end('Server error');
      return;
    }

    res.statusCode = 200;
    res.end('OK');
  });
};
