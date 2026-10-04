export function getArticleContentBlocks(content = []) {
  return content
    .map((block) =>
      typeof block === 'string'
        ? { type: 'paragraph', text: block.trim() }
        : block,
    )
    .filter((block) => {
      if (!block || !block.type) return false
      if (block.type === 'image') return Boolean(block.src)
      return Boolean(block.text?.trim())
    })
}
