import assert from 'node:assert/strict'
import test from 'node:test'

import { getArticleContentBlocks } from '../src/blogContent.js'
import { blogArticles } from '../src/content/blog.js'
import { loadArticleContent } from '../src/content/blogLoaders.js'

test('公众号文件夹的 26 篇文章全部替换网站旧博客', () => {
  assert.equal(blogArticles.length, 26)
  assert.equal(new Set(blogArticles.map(({ id }) => id)).size, 26)
  assert.ok(blogArticles.every(({ sourceFile }) => sourceFile.endsWith('.docx')))
})

test('经营业务文章固定为精选，其余文章按文件修改时间从早到晚排列', () => {
  const featuredArticles = blogArticles.filter(({ featured }) => featured)
  const regularArticles = blogArticles.filter(({ featured }) => !featured)

  assert.equal(featuredArticles.length, 1)
  assert.equal(featuredArticles[0].title, 'LESHEN 乐绅｜我们如何经营业务：关于真实、隐私、专业与长期主义')
  assert.deepEqual(
    regularArticles.map(({ modifiedAt }) => modifiedAt),
    regularArticles.map(({ modifiedAt }) => modifiedAt).toSorted(),
  )
  assert.equal(regularArticles[0].title, '自然，不是头发越多越好｜乐绅的男士发型设计标准')
})

test('文章正文按需加载并保留段落、标题和配图等结构化内容', async () => {
  const articleContents = await Promise.all(
    blogArticles.map(({ id }) => loadArticleContent(id)),
  )
  const blocks = articleContents.flatMap((content) => getArticleContentBlocks(content))
  const blockTypes = new Set(blocks.map(({ type }) => type))

  assert.ok(blogArticles.every((article) => !Object.hasOwn(article, 'content')))
  assert.ok(blockTypes.has('paragraph'))
  assert.ok(blockTypes.has('heading'))
  assert.ok(blockTypes.has('image'))
  assert.ok(
    blocks
      .filter(({ type }) => type === 'image')
      .every(({ src }) => src.startsWith('/blog/') && src.endsWith('.webp')),
  )
})

test('正文标准化兼容旧的纯文本段落', () => {
  assert.deepEqual(getArticleContentBlocks(['第一段', '', '第二段']), [
    { type: 'paragraph', text: '第一段' },
    { type: 'paragraph', text: '第二段' },
  ])
})
