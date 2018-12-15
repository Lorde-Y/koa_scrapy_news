import Router from 'koa-router';

import dataFromJuejin from './juejin.controller.js';


const router = new Router();

router.get('/', dataFromJuejin.scrapyNewsFromJuejin); //获取掘金文章

export default router;