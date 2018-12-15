import mongoose from 'mongoose';
const Schema = mongoose.Schema;

/**
 * repositorySchema // github项目star数量 > 999 可自定义
 * repositoryName: 仓库名称
 * repositoryLink: 仓库链接
 * repositoryDesc: 仓库描述
 * repositoryType: 仓库类型（javascript/css/html/go...)
 * repositoryStars: 仓库star数量
 * repositoryUpdateTime: 仓库更新时间
 *  createDate: 爬取时间
 */
const gitRepositorySchema = new Schema({
  repositoryName: String,
  repositoryLink: String,
  repositoryDesc: String,
  repositoryType: String,
  repositoryStars: String,
  repositoryUpdateTime: String,
  createDate: { type: Date, default: Date.now() }
});

const GitRepo = mongoose.model('gitRepository', gitRepositorySchema);

export default GitRepo;
