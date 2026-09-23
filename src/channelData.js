export const channelCatalog = [
  {
    id: 'taobao',
    name: '淘宝',
    englishName: 'TAOBAO STORE',
    webUrl: 'https://m.tb.cn/h.8uSmiRhVyvslBtz',
    miniProgramToken: '',
    poster: '/channels/taobao.jpg',
    theme: 'orange',
  },
  {
    id: 'douyin',
    name: '抖店',
    englishName: 'DOUYIN STORE',
    webUrl: 'https://v.douyin.com/AcuHBFA7Tvk/',
    miniProgramToken: '',
    poster: '/channels/douyin.jpg',
    theme: 'charcoal',
  },
  {
    id: 'dianping',
    name: '大众点评',
    englishName: 'DIANPING',
    webUrl: 'https://www.dianping.com/shop/G7S6svtQ1frJgbi2',
    miniProgramToken: '#小程序://大众点评美食电影运动旅游门票/n30DiDTdqNd156x',
    poster: '/channels/dianping.jpg',
    theme: 'coral',
  },
  {
    id: 'meituan',
    name: '美团',
    englishName: 'MEITUAN',
    webUrl: '',
    miniProgramToken: '#小程序://美团丨外卖团购特价美食酒店电影/C6Sdh288RnYLamp',
    poster: '',
    theme: 'yellow',
  },
]

export function getChannelActions(channelId) {
  const channel = channelCatalog.find(({ id }) => id === channelId)

  if (!channel) return []

  return [
    channel.webUrl ? { type: 'external', value: channel.webUrl } : null,
    channel.miniProgramToken
      ? { type: 'miniProgram', value: channel.miniProgramToken }
      : null,
  ].filter(Boolean)
}

export function createChannelTrackingPayload(channel, action) {
  return {
    event: 'channel_click',
    channel,
    action,
  }
}
