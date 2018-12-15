import puppeteer from 'puppeteer';
import GitRepoModel from './github.model.js';
import GitUsersModel from './user.model.js';
import fs from 'fs';

class GitHub {
  constructor() {
    this.searchUrl = 'https://github.com/search';
  }
  filterQueryParams(params) {
    let queryString = '';
    for (let key in params) {
      queryString += `${key}=${params[key]}&`;
    }
    return queryString;
  }
  sleep(seconds) {
    console.log('sleeping....');
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve();
      }, seconds);
    });
  }
  mostStarsParams() {
    return {
      l: '',
      o: 'desc',
      q: encodeURIComponent('stars:>999'),
      s: 'stars',
      type: 'Repositories'
    };
  }
  run() {
    this.getMostStarsRepositories();
    this.getMostFollowers();
  }
  /**
   * [getMostStarsRepositories 获取stars最多]
   * @return {[type]} [description]
   */
  getMostStarsRepositories() {
    const queryString = this.filterQueryParams(this.mostStarsParams());
    const searchUrl = `${this.searchUrl}?${queryString}`;
    let scrapyRepo = async () => {
      const borwser = await puppeteer.launch({
        headless: true
      });
      const page =  await borwser.newPage();
      await page.goto(searchUrl);
      await page.waitFor('.next_page');

      const totalPages = await page.$eval('.next_page', el => {
        const $prevEl = el.previousElementSibling;
        return $prevEl.innerText;
      });

      await this.sleep(5000);

      for (let i = 1; i <= totalPages; i ++) {
        console.log(new Date());
        // 睡眠5s，防止被禁！！！
        await this.sleep(5000);
        console.log(new Date());
        console.log('ready...to...page...');
        await page.goto(`${searchUrl}p=${i}`);
        await page.waitFor(5000);
        const result = await page.$$eval('.repo-list-item', el => {
          return Array.prototype.slice.apply(el).map(item => {
            const $firstChild = item.firstElementChild;
            const $lastChild = item.lastElementChild;

            const repositoryName = $firstChild.querySelector('h3').innerText;
            const repositoryLink = $firstChild.querySelector('h3').firstElementChild.getAttribute('href');
            let repositoryDesc = '';
            const $descElement = $firstChild.querySelector('.d-inline-block');
            if ($descElement) {
              repositoryDesc = $descElement.innerHTML;
            }
            const repositoryUpdateTime = $firstChild.lastElementChild.querySelector('.text-gray').innerHTML;

            const repositoryType = $lastChild.firstElementChild.innerText;
            const repositoryStars = $lastChild.lastElementChild.firstElementChild.innerText;
            
            return  {
              repositoryName,
              repositoryLink,
              repositoryDesc,
              repositoryUpdateTime,
              repositoryType,
              repositoryStars,
            };
          })
        });
        result.map(async item => {
          const { repositoryName } = item;
          await GitRepoModel.findOneAndUpdate({repositoryName}, item, {upsert: true});
        });
      }
      await browser.close();
    }
    scrapyRepo().then(()=> {
      console.log('open..puppeteer..success');
    })
  }
  mostFollowersParams() {
    return {
      q: encodeURIComponent('followers:>1000'),
      utf8: '✓',
      type: 'users',
      ref: 'advsearch'
    }
  }
  getMostFollowers() {
    const queryString = this.filterQueryParams(this.mostFollowersParams());
    const searchUrl = `${this.searchUrl}?${queryString}`;
    let scrapyRepo = async () => {
      const borwser = await puppeteer.launch({
        headless: true
      });
      const page =  await borwser.newPage();
      await page.goto(searchUrl);
      await page.waitFor('.next_page');

      const totalPages = await page.$eval('.next_page', el => {
        const $prevEl = el.previousElementSibling;
        return $prevEl.innerText;
      });

      await this.sleep(5000);

      for (let i = 1; i <= totalPages; i ++) {
        console.log(new Date());
        // 睡眠5s，防止被禁！！！
        await this.sleep(5000);
        console.log(new Date());
        console.log('ready...to...page...');
        await page.goto(`${searchUrl}p=${i}`);
        await page.waitFor(5000);
        const result = await page.$$eval('.user-list-item', el => {
          return Array.prototype.slice.apply(el).map(item => {
            const $leftChild = item.firstElementChild;

            const $firstChild = $leftChild.firstElementChild;
            const $lastChild = $leftChild.lastElementChild;

            const avatar = $firstChild.querySelector('.avatar').getAttribute('src');

            const userName = $lastChild.firstElementChild.innerText;
            const $subUserName = $lastChild.querySelector('.d-block');
            let subUserName = '';
            if ($subUserName) {
              subUserName = $subUserName.innerText;
            }

            const $userDesc = $lastChild.querySelector('p.f5');
            let userDesc = '';
            if ($userDesc) {
              userDesc = $userDesc.innerText;
            }

            const $ul = $lastChild.querySelector('ul.user-list-meta');
            const $li = $ul.querySelectorAll('li');
            let location = '';
            let email = '';
            const len = $li.length;
            if (len) {
              if (len === 1) {
                location = $ul.firstElementChild.innerText;
                email = '1231312312';
              }
              if (len === 2) {
                location = $ul.firstElementChild.innerText;
                email = $ul.lastElementChild.lastElementChild.innerText;
              }
            }
            return  {
              avatar,
              userName,
              subUserName,
              userDesc,
              location,
              email
            };
          })
        });
        console.log(result);
        result.map(async item => {
          const { userName } = item;
          await GitUsersModel.findOneAndUpdate({userName}, item, {upsert: true});
        });
      }
      await browser.close();
    }
    scrapyRepo().then(()=> {
      console.log('open..puppeteer..success');
    })
  }
}

export default new GitHub()
