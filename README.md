### How to start
```bash
npm start
```

### 获取juejin数据-接口--get请求
```bash
http://localhost:3000/api/juejin/
```

### pm2
```bash
pm2 start start.js --name scrapy
pm2 start start.js --watch // 当文件变化时自动重启应用
```

### 新建邮箱发送文件
```shell
vi api/email/config.js

// 需要发送的邮箱列表
export default {
  userEmail: ['1@qq.com', '2@qq.com']
}
```