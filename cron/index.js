import Cron from 'cron';
import dataFromJuejin from '../api/juejin/juejin.controller.js';
import dataFromGitHub from '../api/github/github.controller.js';
import Emailer from '../api/email';

const cronJob = Cron.CronJob;

/**
 * [每隔一分钟执行一次]
 * @return {[type]} [description]
 */
export const JuejinJob = () => {
  const task = new cronJob('0 */1 * * * *', function() {
    const d = new Date();
    console.log('Every one Minute:', d);
    dataFromJuejin.scrapyNewsFromJuejin();
  });
  console.log('After job instantiation');
  task.start();
};

export const GitHubJob = () => {
  // const task = new cronJob('30 30 9 * * 1', function() {
  //   const d = new Date();
  //   console.log('Every one week 9:30:30:', d);
  //   dataFromGitHub.run();
  // }, null, true, 'Asia/Chongqing');
  // console.log('After job instantiation');
  // task.start(); 
}

export const SendEmailer = () => {
  const task = new cronJob('0 10 19 * * *', function() {
    const d = new Date();
    console.log('Every one week 20:00:00:', d);
    Emailer.run();
  }, null, true, 'Asia/Chongqing');
  console.log('After job instantiation');
  task.start(); 
}