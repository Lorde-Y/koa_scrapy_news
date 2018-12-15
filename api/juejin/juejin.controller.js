import request from 'request';
import rp from 'request-promise';
import juejinModel from './juejin.model.js';
import categoryObj from './category';
import fs from 'fs';

class Juejin {
  constructor() {
    this.count = 0;
    this.repeatCount = 0;
    this.hotTimer = null;
    this.newTimer = null;
    this.categoryId = null;
    this.categoryTitle = null;
    this.newsStatus = null;

    this.startHotPageNum = 1;
    this.startNewPageNum = 1;
    this.setTotalNum = Math.floor(Math.random() * 60 + 10);

    this.hotFinishedFlag = null;
    this.newFinishedFlag = null;
    this.randomCategory();
  }
  randomCategory() {
    const random = Math.floor(Math.random() * 6);
    const { title, id } = categoryObj[random];
    this.categoryId = id;
    this.categoryTitle = title;
  }
  fetcnDataFromRequest (url, status) {
    return new Promise((resolve, reject) => {
      request({
        method: 'GET',
        url: url,
        json: 'Content-type: application/json'
      }, (error, res, data) => {
        if (error) {
          return reject(error)
        }
        resolve(data);
      })
    })
  }
  /**
   * [getRandomType 获取随机--数据类型]
   * @return {[type]} [description]
   * 最新链接--规则： 根据ISO时间，往前推一天
   * https://timeline-merger-ms.juejin.im/v1/get_entry_by_timeline
   * ?src=web&before=2017-09-19T07%3A48%3A15.354Z&limit=20&tag=5597a05ae4b08a686ce56f6f
   
   * 最热链接--规则： 随机生成before的值
   * https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank
   * ?src=web&before=0.027320297817573&limit=20&tag=5597a05ae4b08a686ce56f6f
   */
  getRandomType() {
    let scrapyUrl = '';
    let before = '';
    const types = ['hot', 'new'];
    const randomType = Math.floor(Math.random() * 2);
    this.newsStatus = types[randomType];
    if (this.newsStatus === 'hot') {
      let random = Math.floor(Math.random() * 100000000000000).toString();
      let firstRandom = Math.floor(Math.random() * 10).toString();
      before = `${firstRandom}.${random}`;
      scrapyUrl = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank';
    }
    if (this.newsStatus === 'new') {
      let currentDate = new Date();
      const oneDay = 1 * 24 * 60 * 60 * 1000;
      currentDate = currentDate - oneDay;
      before = new Date(currentDate);
      before = encodeURIComponent(before.toISOString());
      scrapyUrl = 'https://timeline-merger-ms.juejin.im/v1/get_entry_by_timeline';
    }
    return {
      before,
      scrapyUrl
    };
  }
  /**
   * [getRandomScrapyUrl 获取随机爬虫链接]
   * @return {[type]} [description]
  **/
  getRandomScrapyUrl() {
    const randomType = this.getRandomType();
    // 每页随机数据：随机20 - 60
    const limitPage = Math.floor(Math.random() * 60 + 20);
    const params = {
      src: 'web',
      limit: limitPage,
      before: randomType.before,
      category: this.categoryId,
    };
    let queryString = '';
    for (let key in params) {
      queryString += `${key}=${params[key]}&`;
    }
    return `${randomType.scrapyUrl}?${queryString}`;
  }
  scrapyNewsFromJuejin() {
    this.randomCategory();
    const url = this.getRandomScrapyUrl();
    console.log(url);
    this.fetcnDataFromRequest(url).then((data) => {
      this.filterData(data);
    }).catch(err =>{
      fs.appendFileSync('../juejin.error.log', `link:${url}, ${JSON.stringify(err)}\n`);
      console.log(err);
    })
  }
  checkFinishedFlag() {
    if (this.newsStatus === 'hot') {
      this.hotFinishedFlag = true;
    }
    if (this.newsStatus === 'new') {
      this.newFinishedFlag = true;
    }
    if (this.hotFinishedFlag && this.newFinishedFlag) {
      this.destoryVariable();
    }
  }
  /**
   * [filterData 对数据进行筛选处理]
   * @param  {[type]} data [description]
   * @return {[type]}      [description]
   */
  filterData (data) {
    if (!data || (data && data.m !== 'ok')) {
      console.log(`fetch data from juejin，状态为${this.categoryTitle}--${this.newsStatus},即将结束！`);
      console.log(`总共抓取文件：${this.count}`);
      console.log(`重复文件：${this.repeatCount}`);
      this.checkFinishedFlag();
      // console.log(new Error('*********juejin again***********'));
      return;
    }
    const list = data.d.entrylist;
    for (let i = 0, len = list.length; i < len; i++) {
      const item = list[i];
      const { title, viewsCount, type, summaryInfo, user, objectId, category, tags, originalUrl, content, screenshot} = item;
      const { community, avatarLarge } = user;
      const filterTags = tags.map((tag) => {
        return tag.title;
      });
      const fileterCateory = {
        id: category.id,
        name: category.name,
        title: category.title
      };
      let url = null;
      if (type === 'article') {
        url = `/entry/${item.objectId}/detail`;
      }
      if (type === 'post') {
        url = `/post/${item.objectId}`;
      }
      const params = {
        objectId,
        title,
        url,
        originalUrl,
        viewsCount,
        summaryInfo,
        avatarLarge,
        content,
        screenshot,
        status: this.newsStatus,
        tags: filterTags,
        categoryId: category.id,
        category: fileterCateory,
        author: user.username,
        user: JSON.stringify(user),
        community: JSON.stringify(community),
        createDate: item.createdAt
      };
      this.saveToCollections(params);
    }
  }
  async saveToCollections (params) {
    const { objectId, title, author, url } = params;
    let juejin = await juejinModel.findOne({objectId});
    if (juejin) {
      this.repeatCount++;
      console.log(`${this.categoryTitle}---juejin: ${title} exists....`);
      return;
    }
    console.log(`爬取状态为${this.categoryTitle}--${this.newsStatus}`);
    return new juejinModel(params).save((err, res) => {
      if (err) {
        fs.appendFileSync('../juejin.error.log', `${url} save error\n`);
        return console.log(err);
      }
      this.count++;
      console.log(`juejin----: ${author} ： ${title} 保存成功.`);
    })
  }
  destoryVariable (){
    console.log('************正在清理变量************');
    this.count = null;
    this.repeatCount = null;
    this.hotTimer = null;
    this.newTimer = null;
    this.categoryId = null;
    this.categoryTitle = null;

    this.startHotPageNum = null;
    this.startNewPageNum = null;
    this.setTotalNum = null;
    this.hotFinishedFlag = null;
    this.newFinishedFlag = null;
  }
}

export default new Juejin()
