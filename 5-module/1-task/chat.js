const connections = [];

exports.subscribe = function(ctx) {
  return new Promise((resolve) => {
    const connData = {resolve, ctx};

    connections.push(connData);
    ctx.req.on('close', () => {
      const pos = connections.indexOf(connData);
      connections.splice(pos, 1);
    });
  });
};

exports.send = function(message) {
  connections.forEach(({resolve, ctx}) => {
    ctx.body = message;
    resolve();
  });
  connections.length = 0;
};
