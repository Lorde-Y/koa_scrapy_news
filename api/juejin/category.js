/**
 * 最新链接 : 规则： 根据ISO时间，往前推一天
 * https://timeline-merger-ms.juejin.im/v1/get_entry_by_timeline?src=web&before=2017-09-19T07%3A48%3A15.354Z&limit=20&tag=5597a05ae4b08a686ce56f6f
 *
 * 最热链接 : 规则： 随机生成before的值
 * https://timeline-merger-ms.juejin.im/v1/get_entry_by_rank?src=web&before=0.027320297817573&limit=20&tag=5597a05ae4b08a686ce56f6f
 */
const categoryObj = [{
  id: '5562b415e4b00c57d9b94ac8',
  name: '前端',
  title: 'frontend'
},
{
  id: '5562b419e4b00c57d9b94ae2',
  name: '后端',
  title: 'backend'
},
{
  id: "5562b405e4b00c57d9b94a41",
  name: "iOS",
  title: "ios"
},
{
  id: "5562b410e4b00c57d9b94a92",
  name: "Android",
  title:"android"
},
{
  id: "57be7c18128fe1005fa902de",
  name: "人工智能",
  title: "ai"
},
{
  id: "5562b422e4b00c57d9b94b53",
  name: "工具资源",
  title: "freebie"
}];

export default categoryObj;