
const env = process.env.NODE_ENV || 'development';

export default {
  port: 3000,
  dbName: env === 'development' ? 'scrapy_news_dev' : 'scrapy_news_pro',
};