const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();
app.use(require('koa-static')('public'));
app.use(require('koa-bodyparser')());

app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    if (err.status) {
      ctx.status = err.status;
      ctx.body = {error: err.message};
    } else {
      ctx.status = 500;
      ctx.body = {error: 'Internal server error'};
    }
  }
});


const router = new Router();
const User = require('./models/User');

router.get('/users', async (ctx) => {
  ctx.body = await User.find();
});

router.get('/users/:id', async (ctx) => {
  ctx.body = await findUserById(ctx);
});

router.patch('/users/:id', async (ctx) => {
  const user = await findUserById(ctx);
  const reqBody = ctx.request.body;
  user.email = reqBody.email || user.email;
  user.displayName = reqBody.displayName || user.displayName;

  try {
    ctx.body = await user.save();
  } catch (err) {
    ctx.status = 400;
    ctx.body = getValidationError(err);
  }
});

router.post('/users', async (ctx, next) => {
  const reqBody = ctx.request.body;
  const user = new User();
  user.email = reqBody.email;
  user.displayName = reqBody.displayName;

  try {
    ctx.body = await user.save();
  } catch (err) {
    ctx.status = 400;
    ctx.body = getValidationError(err);
  }
});

router.delete('/users/:id', async (ctx) => {
  const user = await findUserById(ctx);
  try {
    await user.deleteOne({_id: user._id});
    ctx.body = {
      success: 1,
    };
  } catch (err) {
    ctx.body = getValidationError(err);
  }
});

app.use(router.routes());


async function findUserById(ctx) {
  let user;

  try {
    user = await User.findOne({_id: ctx.params.id});
  } catch (e) {
    ctx.throw(400);
  }

  return user || ctx.throw(404);
}

function getValidationError(err) {
  return {
    errors: Object.keys(err.errors).reduce((acc, key) => {
      acc[key] = err.errors[key].message;
      return acc;
    }, {}),
  };
}


module.exports = app;
