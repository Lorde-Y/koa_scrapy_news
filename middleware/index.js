export function errorMiddleware () {
  return async (ctx, next) => {
    try {
      await next();
      if (ctx.status === 404) {
        ctx.throw(404);
      }
    } catch (err) {
      const status = err.status || 500;
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          ctx.type = 'html';
          await ctx.render('error', {
            title: status,
            error: err,
          });
          break;
        case 'json':
          ctx.body = {
            message: 'Page Not Found'
          };
          break;
        default:
          ctx.type = 'text';
          ctx.body = 'Page Not Found';
      }
      ctx.app.emit('error', err, ctx);
    }
  };
};