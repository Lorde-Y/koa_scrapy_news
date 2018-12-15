// export function errorMiddleware () {
//   return async (ctx, next) => {
//     try {
//       await next();
//     } catch (err) {
//       console.log('500 error...');
//       ctx.status = 500;
//       ctx.type = 'html';
//       ctx.body = '<p>Something Wrong！！！Wait a minute！</p>';
//       ctx.app.emit('error', err, ctx);
//     }
//   };
// };