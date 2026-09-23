import assert from 'node:assert/strict'
import test from 'node:test'

import {
  channelCatalog,
  createChannelTrackingPayload,
  getChannelActions,
} from '../src/channelData.js'

test('渠道页提供淘宝、抖店、大众点评和美团四个官方入口', () => {
  assert.deepEqual(
    channelCatalog.map(({ id }) => id),
    ['taobao', 'douyin', 'dianping', 'meituan'],
  )

  assert.equal(channelCatalog[0].webUrl, 'https://m.tb.cn/h.8uSmiRhVyvslBtz')
  assert.equal(channelCatalog[1].webUrl, 'https://v.douyin.com/AcuHBFA7Tvk/')
  assert.equal(channelCatalog[2].webUrl, 'https://www.dianping.com/shop/G7S6svtQ1frJgbi2')
})

test('大众点评同时提供店铺链接和小程序口令，美团提供小程序口令', () => {
  assert.deepEqual(getChannelActions('dianping'), [
    { type: 'external', value: 'https://www.dianping.com/shop/G7S6svtQ1frJgbi2' },
    { type: 'miniProgram', value: '#小程序://大众点评美食电影运动旅游门票/n30DiDTdqNd156x' },
  ])
  assert.deepEqual(getChannelActions('meituan'), [
    { type: 'miniProgram', value: '#小程序://美团丨外卖团购特价美食酒店电影/C6Sdh288RnYLamp' },
  ])
})

test('渠道点击统计不携带咨询表单个人信息', () => {
  assert.deepEqual(createChannelTrackingPayload('taobao', 'open'), {
    event: 'channel_click',
    channel: 'taobao',
    action: 'open',
  })
})
