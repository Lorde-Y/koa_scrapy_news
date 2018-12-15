import mongoose from 'mongoose';
import Config from '../config';

mongoose.connect(`mongodb://localhost/${Config.dbName}`);

const db = mongoose.connection;
db.once('open', () => {
  console.log('--mongoose 数据库连接成功--');
});

db.on('error', (err) => {
  console.error(`--mongoose 数据库连接失败: ${err}`);
});

export default db;
