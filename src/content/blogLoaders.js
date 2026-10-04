const articleLoaders = {
  "wechat-f592e724a4": () => import('./blogArticles/wechat-f592e724a4.js'),
  "wechat-aa0efb3827": () => import('./blogArticles/wechat-aa0efb3827.js'),
  "wechat-947e194ce4": () => import('./blogArticles/wechat-947e194ce4.js'),
  "wechat-a7c171ae64": () => import('./blogArticles/wechat-a7c171ae64.js'),
  "wechat-ee4a3c7674": () => import('./blogArticles/wechat-ee4a3c7674.js'),
  "wechat-9a4eb78aaf": () => import('./blogArticles/wechat-9a4eb78aaf.js'),
  "wechat-4c1cdb81c5": () => import('./blogArticles/wechat-4c1cdb81c5.js'),
  "wechat-5fa7bc2c13": () => import('./blogArticles/wechat-5fa7bc2c13.js'),
  "wechat-157f030467": () => import('./blogArticles/wechat-157f030467.js'),
  "wechat-f72cab4e05": () => import('./blogArticles/wechat-f72cab4e05.js'),
  "wechat-e66a77fc82": () => import('./blogArticles/wechat-e66a77fc82.js'),
  "wechat-c505fcfd26": () => import('./blogArticles/wechat-c505fcfd26.js'),
  "wechat-362ec0a6fd": () => import('./blogArticles/wechat-362ec0a6fd.js'),
  "wechat-1645344480": () => import('./blogArticles/wechat-1645344480.js'),
  "wechat-73ee508465": () => import('./blogArticles/wechat-73ee508465.js'),
  "wechat-243921bcff": () => import('./blogArticles/wechat-243921bcff.js'),
  "wechat-cbc74669c5": () => import('./blogArticles/wechat-cbc74669c5.js'),
  "wechat-1db97da287": () => import('./blogArticles/wechat-1db97da287.js'),
  "wechat-fe4f41f1ad": () => import('./blogArticles/wechat-fe4f41f1ad.js'),
  "wechat-7399ffd7ff": () => import('./blogArticles/wechat-7399ffd7ff.js'),
  "wechat-f82b86a0ee": () => import('./blogArticles/wechat-f82b86a0ee.js'),
  "wechat-196c27a7ab": () => import('./blogArticles/wechat-196c27a7ab.js'),
  "wechat-856d7760b9": () => import('./blogArticles/wechat-856d7760b9.js'),
  "wechat-18098be0eb": () => import('./blogArticles/wechat-18098be0eb.js'),
  "wechat-121ea8cda1": () => import('./blogArticles/wechat-121ea8cda1.js'),
  "leshen-business-principles": () => import('./blogArticles/leshen-business-principles.js'),
}

export async function loadArticleContent(articleId) {
  const loader = articleLoaders[articleId]
  if (!loader) throw new Error(`Unknown article: ${articleId}`)
  const module = await loader()
  return module.default
}
