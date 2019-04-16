const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const removeFile = require('./remove-file');

const server = new http.Server();

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);

  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'DELETE':

      if (!pathname || ~pathname.indexOf('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        removeFile(filepath, res);
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
