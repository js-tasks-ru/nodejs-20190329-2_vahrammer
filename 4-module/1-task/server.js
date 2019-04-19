const url = require('url');
const http = require('http');
const path = require('path');
const fs = require('fs');

const server = new http.Server();
const {pipeline} = require('stream');

server.on('request', (req, res) => {
  const pathname = url.parse(req.url).pathname.slice(1);
  const filepath = path.join(__dirname, 'files', pathname);

  switch (req.method) {
    case 'GET':
      if (!pathname) {
        res.end('File Manager');
        return;
      }

      if (~pathname.indexOf('/')) {
        res.statusCode = 400;
        res.end('Bad request');
        return;
      }

      fs.access(filepath, fs.constants.R_OK, (err) => {
        if (err) {
          res.statusCode = 404;
          res.end('Not found');
          return;
        }

        sendFile(filepath, res);
      });
      break;

    default:
      res.statusCode = 501;
      res.end('Not implemented');
  }
});

module.exports = server;


function sendFile(filepath, res) {
  const file = fs.createReadStream(filepath);
  res.setHeader('Content-Type', 'text/plain');

  pipeline(file, res, (err) => {
    if (err) {
      res.statusCode = 500;
      res.end('Internal server error');
    } else {
      res.end();
    }
  });
}
