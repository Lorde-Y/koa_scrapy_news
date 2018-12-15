import Router from 'koa-router';

import dataFromGitHub from './github.controller.js';

// dataFromGitHub.getMostStarsRepositories();
// dataFromGitHub.getMostFollowers();

const router = new Router();

router.get('/', dataFromGitHub.getMostStarsRepositories); //获取掘金文章

export default router;