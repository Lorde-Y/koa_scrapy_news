import nodemailer from 'nodemailer';
// models
import GitRepoModel from '../github/github.model.js';
import GitUsersModel from '../github/user.model.js';
import juejinModel from '../juejin/juejin.model.js';

import Config from './config';

class Emailer {
  /**
   * [getJuejinRecommnedNews 每日推荐10篇热门文章]
   * @return {[type]} [description]
   */
  async getJuejinRecommnedNews() {
    // 前端
    const categoryId = '5562b415e4b00c57d9b94ac8';
    const hotFilter = {
      categoryId,
      status: 'hot',
    };
    const newFilter = {
      categoryId,
      status: 'new',
    };
    const hotData = await juejinModel.find(hotFilter).limit(5).sort({ createDate: -1 });
    const newData = await juejinModel.find(newFilter).limit(5).sort({ createDate: -1 });
    const data = [...hotData, ...newData];
    return Array.from(new Set(data));
  }
  async renderRecommendNewsHtml() {
    const data = await this.getJuejinRecommnedNews();
    let html = '<p>每日推荐：</p>';
    for (let i = 0, len = data.length; i < len; i++) {
      const item = data[i];
      html += `<p><span>${i+1}、</span>
        <a href='${item.originalUrl}'>${item.title}</a>
      </p>`
    };
    return html
  }
  async getDataCountsInfo() {
    const gitRepoCount = await GitRepoModel.find({}).count();
    const gitPopularUsersCount = await GitUsersModel.find({}).count();
    const juejinCount = await juejinModel.find({}).count();
    return {
      gitRepoCount,
      gitPopularUsersCount,
      juejinCount
    }
  }
  async run() {
    const data = await this.getDataCountsInfo();
    const { gitRepoCount, gitPopularUsersCount, juejinCount } = data;
    const transporter = nodemailer.createTransport({
      host: 'smtp.qq.com',
      port: 465,
      secure: true, // true for 465, false for other ports
      auth: {
        user: '670453277@qq.com', // generated ethereal user
        pass: 'xklpzsedayqbbdgi' // generated ethereal password 需要生成授权码，不是qq登录密码
      }
    });

    const recommendNews = await this.renderRecommendNewsHtml();
    const html = `
        <h2>获取数据如下：</h2>
        <p>掘金数据总量：${juejinCount}</p>
        <p>github-most-stars-repo：${gitRepoCount}</p>
        <p>github-most-stars-user：${gitPopularUsersCount}</p>
        ${recommendNews}
    `;
    // setup email data with unicode symbols
    const mailOptions = {
        from: '670453277@qq.com', // sender address
        to: Config.userEmail.join(','), // list of receivers
        subject: '每日Koa爬虫数据', // Subject line
        html: html // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log(`Message sent to: ${mailOptions.to}`);
    });
  }
}

export default new Emailer();