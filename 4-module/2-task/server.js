const fs = require('fs');
const http = require('http');
const path = require('path');
const url = require('url');

const saveFile = require('./send-file-to-client');

const server = new http.Server();


server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'POST':
      if (!pathname || ~pathname.indexOf('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.access(filepath, fs.constants.F_OK, (err) => {
        if (err) {
          saveFile(filepath, req, res);
          return;
        }

        res.statusCode = 409;
        res.end('Conflict');
      });

      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;
