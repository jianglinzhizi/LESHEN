import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'

const appPath = new URL('../src/App.jsx', import.meta.url)
const cssPath = new URL('../src/App.css', import.meta.url)

test('页脚提供四项法律说明并标明个人信息处理者', async () => {
  const source = await readFile(appPath, 'utf8')

  assert.match(source, /都是朋友（上海）假发造型设计有限责任公司/)
  assert.match(source, /《隐私政策》/)
  assert.match(source, /《个人信息收集说明》/)
  assert.match(source, /Cookie \/ 统计技术说明/)
  assert.match(source, /《咨询表单个人信息同意》/)
  assert.match(source, /className="site-footer"/)
})

test('法律说明使用无障碍对话框', async () => {
  const source = await readFile(appPath, 'utf8')

  assert.match(source, /role="dialog"/)
  assert.match(source, /aria-modal="true"/)
  assert.match(source, /legal-modal-title/)
  assert.match(source, /event\.key === 'Escape'/)
})

test('咨询表单要求一般个人信息同意和敏感信息单独同意', async () => {
  const source = await readFile(appPath, 'utf8')

  assert.match(source, /name="privacyConsent"/)
  assert.match(source, /name="sensitiveConsent"/)
  assert.match(source, /id="privacy-consent"/)
  assert.match(source, /id="sensitive-consent"/)
  assert.match(source, /className="consent-list"/)
})

test('页脚、对话框和表单同意区有独立样式', async () => {
  const source = await readFile(cssPath, 'utf8')

  assert.match(source, /\.site-footer\s*\{/)
  assert.match(source, /\.legal-modal-backdrop\s*\{/)
  assert.match(source, /\.consent-list\s*\{/)
  assert.match(source, /\.consent-row\s*\{/)
})
