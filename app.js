import Koa from 'koa';
import bodyParser from 'koa-bodyparser';
import logger from 'koa-logger';
import serverStatic from 'koa-static';
import serverViews from 'koa-views';
import Mongoose from './mongoose';
import Config from './config';
import router from './routes';
import { pageNotFound, errorMiddleware } from './middleware';
import { JuejinJob, GitHubJob, SendEmailer } from './cron';
// import Emailer from './api/email';

const app = new Koa();

app.use(bodyParser());
app.use(logger());

app.use(serverStatic(__dirname + '/public'))

app.use(serverViews(__dirname + '/views', {
  extension: 'pug'
}));

app.use(router.routes());

// app.use(pageNotFound());
app.use(errorMiddleware());

// error-handling
app.on('error', (err, ctx) => {
  console.error('server error', err, ctx)
});

app.listen(Config.port, () => {
  console.log('Example app listening at http://%s:%s', 'localhost', Config.port);
  console.log(`Server started on ${Config.port}`);
});

JuejinJob();
GitHubJob();
SendEmailer();

// Emailer.run();
