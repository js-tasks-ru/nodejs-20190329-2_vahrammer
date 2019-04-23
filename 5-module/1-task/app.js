const Koa = require('koa');
const app = new Koa();

app.use(require('koa-static')('public'));
// app.use(require('koa-logger')());
app.use(require('koa-bodyparser')());

const Router = require('koa-router');
const router = new Router();


const chat = {
  connections: [],

  subscribe: function(ctx) {
    return new Promise((resolve) => {
      const connData = {resolve, ctx};

      this.connections.push(connData);
      ctx.req.on('close', () => {
        const pos = this.connections.indexOf(connData);
        this.connections.splice(pos, 1);
      });
    });
  },

  send: function(message) {
    this.connections.forEach(({resolve, ctx}) => {
      ctx.body = message;
      resolve();
    });
    this.connections.length = 0;
  },
};


router.get('/subscribe', async (ctx, next) => {
  await chat.subscribe(ctx);
});

router.post('/publish', async (ctx, next) => {
  const body = ctx.request.body;

  if (!body || !body.message) {
    ctx.throw(400);
  }

  chat.send(body.message);
  ctx.response.type = 'application/json';
  ctx.body = JSON.stringify({statusText: 'ok'});
});

app.use(router.routes());

module.exports = app;
