import Router from 'koa-router';
import juejinRouter from '../api/juejin';
import githubRouter from '../api/github';

const router = new Router();

router.use('/api/juejin', juejinRouter.routes(), juejinRouter.allowedMethods());//项目

router.use('/api/github', githubRouter.routes(), githubRouter.allowedMethods());//项目


export default router;