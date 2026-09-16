import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { blogArticles, blogCategories, blogCategoryLabels } from './content/blog'
import './App.css'

const heroVideo = 'https://assets.mixkit.co/videos/47577/47577-720.mp4'

gsap.registerPlugin(ScrollTrigger)

const copy = {
  zh: {
    nav: ['品牌', '服务', '博客', 'FAQ', '联系'],
    contact: '预约咨询',
    lang: 'EN',
    heroTitle: '重新建立男性形象自信',
    heroBody:
      'LESHEN乐绅专注男士高端假发定制，从发量、脸型、年龄、职业和生活习惯出发，为每一位顾客设计真正适合自己的发型解决方案。',
    heroCta: '预约一对一咨询',
    heroSubCta: '查看服务流程',
    heroMeta: ['Shanghai', 'Men Hair System', 'Image Design'],
    whatTitle: 'WHAT IS LESHEN?',
    whatBody:
      'LESHEN（乐绅）是一家专注于男士高端假发定制与整体形象设计的品牌，总部位于中国上海。品牌提供男士假发定制、真人发补发、发型设计、日常维护、清洗护理、色素还原与男士潮流烫发。乐绅关注的不只是头发，而是整体形象管理。',
    philosophy: 'LESHEN 的理念',
    philosophyBody: '帮助男性重新建立形象自信。',
    compareTitle: 'LESHEN 和普通假发有什么区别？',
    compareHeaders: ['维度', '乐绅', '普通假发'],
    meaningTitle: '为什么叫 LESHEN？',
    meaningBody:
      '“乐”—幸福、自信、享受生活。\n“绅”—绅士、优雅、负责任的态度。\n乐绅代表一位重视品质、细节和内在自信的现代绅士。',
    servicesTitle: 'LESHEN Services',
    servicesBody:
      '从第一次沟通到长期维护，每一步都围绕自然度、稳定性、舒适度与个人形象定位展开。',
    faqTitle: 'FAQ',
    blogTitle: '博客',
    blogBody: '围绕男士假发、发际线、保养、植发比较和商务形象建立内容库，方便用户检索，也方便后续持续发布。',
    finalTitle: '把头发问题，变成形象方案。',
    finalBody:
      '告诉我们你的脱发情况、期望发型和日常场景，乐绅会为你规划定制、佩戴、护理与后续维护。',
    finalCta: '联系乐绅',
    phone: '电话 / 微信',
    address: '上海 · LESHEN Studio',
  },
  en: {
    nav: ['Brand', 'Services', 'Blog', 'FAQ', 'Contact'],
    contact: 'Book Consultation',
    lang: '中',
    heroTitle: 'Rebuild masculine confidence',
    heroBody:
      'LESHEN creates premium custom hair systems, human-hair replacement and image design for men, bringing hairline, head shape, lifestyle and long-term care into one private service.',
    heroCta: 'Book a consultation',
    heroSubCta: 'View services',
    heroMeta: ['Shanghai', 'Men Hair System', 'Image Design'],
    whatTitle: 'WHAT IS LESHEN?',
    whatBody:
      'LESHEN is a Shanghai-based brand focused on premium men’s hair system customization and complete image design, including human-hair replacement, styling, daily maintenance, cleaning care, color restoration and trend-aware men’s perm styling.',
    philosophy: 'LESHEN Philosophy',
    philosophyBody: 'Helping men rebuild confidence through image design.',
    compareTitle: 'How is LESHEN different?',
    compareHeaders: ['Dimension', 'LESHEN', 'Ordinary wigs'],
    meaningTitle: 'Why LESHEN?',
    meaningBody:
      '“Le” means happiness, confidence and enjoying life.\n“Shen” means gentleman, elegance and a responsible attitude.\nLESHEN represents a modern gentleman who values quality, detail and inner confidence.',
    servicesTitle: 'LESHEN Services',
    servicesBody:
      'From first consultation to long-term aftercare, every step is designed around natural appearance, stability, comfort and personal image.',
    faqTitle: 'FAQ',
    blogTitle: 'Blog',
    blogBody:
      'A searchable content library for hair systems, hairlines, care, transplant comparison and men’s image design.',
    finalTitle: 'Turn hair loss into an image plan.',
    finalBody:
      'Share your hair loss condition, target style and daily scenarios. LESHEN will plan customization, installation, care and follow-up maintenance.',
    finalCta: 'Contact LESHEN',
    phone: 'Phone / WeChat',
    address: 'Shanghai · LESHEN Studio',
  },
}

const comparisons = [
  ['设计方式', '个性化定制', '标准模板'],
  ['自然效果', '高仿真发际线', '容易识别'],
  ['服务体系', '长期维护', '一次性服务'],
  ['形象定位', '男士潮流设计', '单一假发产品'],
  ['材料', '真人发', '化纤'],
]

const services = [
  ['Consultation', '免费咨询', '了解脱发情况、职业形象和日常运动习惯，判断适合的定制方向。'],
  ['Hair System Design', '设计', '根据脸型、头型、发际线和发量密度建立自然方案。'],
  ['Hair Customization', '定制', '真人发材质、底网结构、颜色和长度按个人需求制作。'],
  ['Installation', '佩戴', '使用稳定贴合方式，兼顾牢固度、舒适度与自然度。'],
  ['Maintenance', '护理', '清洗、维护、修剪和状态检查，让假发保持最佳表现。'],
  ['Color Restoration', '色素还原', '针对褪色、氧化和发色不均进行修复，让发丝回到自然状态。'],
  ['Styling', '造型', '结合商务、日常、潮流场景完成整体发型设计。'],
  ['After-sales', '售后维护', '提供后续护理建议与补发维护，延长使用寿命。'],
]

const faqs = [
  ['男士假发会掉吗？', '专用胶片非常牢固。'],
  ['能游泳吗？', '可以游泳，建议游泳后及时清洗护理。'],
  ['可以洗头吗？', '可以，通常建议 2 天一洗。'],
  ['能维持多久？', '正常护理下约 2-3 年。'],
  ['多久护理一次？', '可以补发 2 次，具体时间按佩戴状态安排。'],
  ['会不会被别人发现？', '真人发丝非常自然，正确佩戴通常不会被发现。'],
  ['夏天热吗？', '底网露头皮，透气性较好。'],
  ['可以跑步吗？', '透气且稳定，可以正常运动。'],
  ['能烫吗？', '可以，但会减少使用寿命。'],
  ['能染吗？', '可以。'],
  ['可以坐飞机吗？', '可以。'],
  ['会不会痒？', '经常清洗一般不会痒。'],
  ['下雨怎么办？', '正常打伞即可。'],
  ['怎么睡觉？', '最好取下睡觉，更舒适，也能保护假发。'],
  ['怎么摘？', '从后往前摘取。'],
]

const initialContactForm = {
  name: '',
  phone: '',
  wechat: '',
  city: '',
  budget: '',
  message: '',
}

const contactSubmissionEndpoint = import.meta.env.VITE_ZOHO_LEAD_ENDPOINT || ''
const zohoWebForm = {
  action: 'https://crm.zoho.com.cn/crm/WebToLeadForm',
  xnQsjsdp: 'b8daa6cf1edeb897fcc87db11854308a4fb41b629ce2c7c97e5de4b6f47a7644',
  xmIwtLD: '9449188e6e29b41fb76e402ec255a8f7acd3f959386494b87b96c72ccda97d44adbe9a95133f69266f7afc4907185dc7',
  actionType: 'TGVhZHM=',
}
const languageStorageKey = 'leshen_site_language'

function getInitialLanguage() {
  if (typeof window === 'undefined') return 'zh'

  return localStorage.getItem(languageStorageKey) === 'en' ? 'en' : 'zh'
}

const blogCopy = {
  zh: {
    featured: '精选',
    search: 'Search',
    searchPlaceholder: '搜索：发际线、保养、植发、商务形象...',
    articlesCount: '篇内容',
    moreContent: '更多内容',
    reset: '重置筛选',
    emptyTitle: '没有找到匹配内容',
    emptyBody: '换一个关键词，或者重置分类筛选后再试。',
    backToBlog: '返回博客',
    libraryTitle: '博客内容库',
    libraryBody:
      '汇总男士假发、发际线、保养、植发比较和商务形象相关内容，后续发布的新文章也会统一进入这里。',
    missingTitle: '文章不存在',
    missingBody: '这篇内容可能已经调整，请回到博客内容库重新选择。',
    relatedTitle: '相关文章',
    libraryKicker: 'LESHEN Blog Library',
  },
  en: {
    featured: 'Featured',
    search: 'Search',
    searchPlaceholder: 'Search: hairline, care, transplant, business image...',
    articlesCount: 'articles',
    moreContent: 'More Content',
    reset: 'Reset',
    emptyTitle: 'No matching content',
    emptyBody: 'Try another keyword or reset the category filter.',
    backToBlog: 'Back to Blog',
    libraryTitle: 'Blog Library',
    libraryBody:
      'A complete library covering men’s hair systems, hairlines, care, transplant comparison and business image. Future articles will be collected here.',
    missingTitle: 'Article not found',
    missingBody: 'This article may have changed. Please return to the blog library and choose again.',
    relatedTitle: 'Related Articles',
    libraryKicker: 'LESHEN Blog Library',
  },
}

const faqCopy = {
  zh: {
    moreQuestions: '更多问答',
    backToFaq: '返回FAQ',
    libraryTitle: '更多问答',
    libraryBody:
      '汇总乐绅男士高端定制假发常见问题，包含佩戴、护理、运动、睡觉、烫染和日常使用等完整说明。',
  },
  en: {
    moreQuestions: 'More FAQ',
    backToFaq: 'Back to FAQ',
    libraryTitle: 'More FAQ',
    libraryBody:
      'A complete FAQ library covering wearing, care, exercise, sleep, perming, coloring and daily use for LESHEN custom men’s hair systems.',
  },
}

function getCategoryLabel(category, language) {
  return blogCategoryLabels[category]?.[language] || category
}

function getArticleCopy(article, language) {
  if (!article) return null

  if (language === 'en' && article.en) {
    return {
      ...article,
      title: article.en.title,
      category: getCategoryLabel(article.category, language),
      summary: article.en.summary,
      content: article.en.content,
      tags: article.en.tags,
    }
  }

  return {
    ...article,
    category: getCategoryLabel(article.category, language),
  }
}

function getMotionTextUnits(text) {
  if (text === '重新建立男性形象自信') {
    return ['重新建立男性', '形象自信']
  }

  if (text.includes(' ')) {
    return text.split(/(\s+)/).filter(Boolean)
  }

  return Array.from(text)
}

function MotionTitle({ children }) {
  return (
    <span className="motion-title" aria-label={children}>
      {getMotionTextUnits(children).map((unit, index) => (
        <span className="motion-title-mask" aria-hidden="true" key={`${unit}-${index}`}>
          <span className="motion-title-unit">{unit.trim() ? unit : '\u00A0'}</span>
        </span>
      ))}
    </span>
  )
}

function OpeningAnimationLayer() {
  return (
    <div className="opening-curtain" aria-hidden="true">
      <div className="opening-panel is-left" />
      <div className="opening-panel is-right" />
      <div className="opening-word">
        <span>乐绅</span>
        <small>专注男士高端假发定制</small>
      </div>
    </div>
  )
}

function createZohoLeadPayload(form) {
  const description = [
    `微信：${form.wechat}`,
    `预算区间：${form.budget}`,
    `所在城市：${form.city}`,
    '',
    '需求说明：',
    form.message,
  ].join('\n')

  return {
    source: 'leshen-official-site',
    submittedAt: new Date().toISOString(),
    module: 'Leads',
    zohoLead: {
      Last_Name: form.name,
      Phone: form.phone,
      City: form.city,
      Lead_Source: 'Website',
      Company: '个人客户',
      Description: description,
    },
    rawFields: {
      contactName: form.name,
      phone: form.phone,
      wechat: form.wechat,
      city: form.city,
      budget: form.budget,
      requirement: form.message,
      email: '',
    },
  }
}

async function submitZohoWebForm(inquiry) {
  const fields = {
    xnQsjsdp: zohoWebForm.xnQsjsdp,
    zc_gad: '',
    xmIwtLD: zohoWebForm.xmIwtLD,
    actionType: zohoWebForm.actionType,
    returnURL: 'null',
    ldeskuid: '',
    LDTuvid: '',
    Company: inquiry.zohoLead.Company,
    'Last Name': inquiry.zohoLead.Last_Name,
    Mobile: inquiry.zohoLead.Phone,
    Email: inquiry.rawFields.email || '',
    'Address - City': inquiry.zohoLead.City,
    Description: inquiry.zohoLead.Description,
    aG9uZXlwb3Q: '',
  }

  const response = await fetch(zohoWebForm.action, {
    method: 'POST',
    body: new URLSearchParams(fields),
  })
  const html = await response.text()
  const confirmation = new DOMParser()
    .parseFromString(html, 'text/html')
    .getElementById('wf_thankyoumessage')

  if (!response.ok || !confirmation) {
    throw new Error(`Zoho Web form did not confirm the submission (${response.status})`)
  }
}

const dimensionTranslations = {
  设计方式: 'Design method',
  自然效果: 'Natural effect',
  服务体系: 'Service system',
  形象定位: 'Image positioning',
  材料: 'Material',
}

const valueTranslations = {
  个性化定制: 'Personalized custom design',
  标准模板: 'Standard template',
  高仿真发际线: 'Realistic hairline',
  容易识别: 'Easy to notice',
  长期维护: 'Long-term maintenance',
  一次性服务: 'One-time service',
  男士潮流设计: 'Men’s style design',
  单一假发产品: 'Single wig product',
  真人发: 'Human hair',
  化纤: 'Synthetic fiber',
}

const serviceEn = {
  Consultation: ['Consultation', 'Understand hair loss, professional image and daily habits before choosing a custom direction.'],
  'Hair System Design': ['Design', 'Build a natural plan around face shape, head shape, hairline and density.'],
  'Hair Customization': ['Customization', 'Human hair material, base structure, color and length are made for the individual.'],
  Installation: ['Installation', 'A stable attachment method balancing hold, comfort and natural appearance.'],
  Maintenance: ['Maintenance', 'Cleaning, care, trimming and condition checks keep the system performing well.'],
  'Color Restoration': ['Color Restoration', 'Repair fading, oxidation and uneven color for a more natural hair tone.'],
  Styling: ['Styling', 'Complete image styling for business, daily and trend-focused scenarios.'],
  'After-sales': ['After-sales Care', 'Ongoing care guidance and maintenance support to extend service life.'],
}

const faqEn = {
  '男士假发会掉吗？': ['Will a men’s hair system fall off?', 'Professional adhesive tapes are very secure.'],
  '能游泳吗？': ['Can I swim?', 'Yes. Clean and care for it after swimming.'],
  '可以洗头吗？': ['Can I wash my hair?', 'Yes. Washing every two days is usually recommended.'],
  '能维持多久？': ['How long does it last?', 'Around 2-3 years with proper care.'],
  '多久护理一次？': ['How often should I maintain it?', 'It can be replenished twice; timing depends on wearing condition.'],
  '会不会被别人发现？': ['Will others notice it?', 'Human hair looks natural when worn correctly.'],
  '夏天热吗？': ['Is it hot in summer?', 'The base exposes the scalp and remains breathable.'],
  '可以跑步吗？': ['Can I run?', 'Yes. It is breathable and stable for normal exercise.'],
  '能烫吗？': ['Can it be permed?', 'Yes, but perming may shorten lifespan.'],
  '能染吗？': ['Can it be dyed?', 'Yes.'],
  '可以坐飞机吗？': ['Can I fly with it?', 'Yes.'],
  '会不会痒？': ['Will it itch?', 'Regular cleaning usually prevents itching.'],
  '下雨怎么办？': ['What about rain?', 'Use an umbrella as usual.'],
  '怎么睡觉？': ['How should I sleep?', 'Removing it is more comfortable and protects the system.'],
  '怎么摘？': ['How do I remove it?', 'Remove it from back to front.'],
}

function BrandMark() {
  return (
    <a className="brand-mark" href="/#home" aria-label="LESHEN home">
      <span className="brand-symbol">L</span>
      <span>
        <strong>LESHEN</strong>
        <small>乐绅</small>
      </span>
    </a>
  )
}

function Header({ language, setLanguage, t }) {
  const navTargets = ['what-is-leshen', 'service', 'blog', 'faq', 'contact']

  return (
    <header className="site-header">
      <BrandMark />
      <nav aria-label="Primary navigation">
        {t.nav.map((item, index) => (
          <a href={`/#${navTargets[index]}`} key={item}>
            {item}
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button
          className="language-toggle"
          type="button"
          onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')}
          aria-label="Switch language"
        >
          {t.lang}
        </button>
        <a className="contact-button" href="/#contact">
          {t.contact}
        </a>
      </div>
    </header>
  )
}

function Hero({ t }) {
  return (
    <section className="hero-section" id="home">
      <video
        className="hero-video"
        src={heroVideo}
        autoPlay
        muted
        loop
        playsInline
        aria-hidden="true"
      />
      <div className="hero-fallback" aria-hidden="true" />
      <div className="hero-shade" aria-hidden="true" />
      <div className="container hero-content">
        <div className="hero-copy">
          <h1>
            <MotionTitle>{t.heroTitle}</MotionTitle>
          </h1>
          <p>{t.heroBody}</p>
          <div className="hero-actions">
            <a className="primary-cta" href="#contact">
              {t.heroCta}
            </a>
            <a className="ghost-cta" href="#service">
              {t.heroSubCta}
            </a>
          </div>
        </div>
        <div className="hero-meta" aria-label="Brand tags">
          {t.heroMeta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
      </div>
    </section>
  )
}

function WhatSection({ t, language }) {
  return (
    <section className="section what-section" id="what-is-leshen">
      <div className="container split-layout">
        <div className="section-heading">
          <BrandMark />
          <h2>{t.whatTitle}</h2>
          <p>{t.whatBody}</p>
        </div>
        <div className="brand-panels">
          <article className="principle-panel">
            <span>{t.philosophy}</span>
            <p>{t.philosophyBody}</p>
          </article>
          <article className="comparison-panel">
            <h3>{t.compareTitle}</h3>
            <div className="comparison-table" role="table" aria-label={t.compareTitle}>
              <div className="comparison-row comparison-head" role="row">
                {t.compareHeaders.map((header) => (
                  <span role="columnheader" key={header}>
                    {header}
                  </span>
                ))}
              </div>
              {comparisons.map(([dimension, leshen, ordinary]) => (
                <div className="comparison-row" role="row" key={dimension}>
                  <span role="cell">
                    {language === 'zh' ? dimension : dimensionTranslations[dimension]}
                  </span>
                  <strong role="cell">
                    {language === 'zh' ? leshen : valueTranslations[leshen]}
                  </strong>
                  <span role="cell">
                    {language === 'zh' ? ordinary : valueTranslations[ordinary]}
                  </span>
                </div>
              ))}
            </div>
          </article>
          <article className="name-panel">
            <span>{t.meaningTitle}</span>
            <p>{t.meaningBody}</p>
          </article>
        </div>
      </div>
    </section>
  )
}

function ServicesSection({ t, language }) {
  return (
    <section className="section services-section" id="service">
      <div className="container">
        <div className="section-heading wide">
          <h2>{t.servicesTitle}</h2>
          <p>{t.servicesBody}</p>
        </div>
        <div className="service-stack">
          {services.map(([title, zhTitle, body], index) => (
            <article className="service-card" key={title}>
              <span className="service-index">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>{title}</h3>
                <strong>{language === 'zh' ? zhTitle : serviceEn[title][0]}</strong>
              </div>
              <p>{language === 'zh' ? body : serviceEn[title][1]}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}

function FaqAccordion({ items, language, idPrefix }) {
  const [openFaqIndex, setOpenFaqIndex] = useState(0)

  function toggleFaq(index) {
    setOpenFaqIndex((current) => (current === index ? null : index))
  }

  return (
    <div className="faq-accordion">
      {items.map(([question, answer], index) => {
        const isOpen = openFaqIndex === index
        const translatedQuestion = language === 'zh' ? question : faqEn[question][0]
        const translatedAnswer = language === 'zh' ? answer : faqEn[question][1]
        const answerId = `${idPrefix}-${index}`

        return (
          <article className={`faq-item ${isOpen ? 'is-open' : ''}`} key={question}>
            <button
              aria-controls={answerId}
              aria-expanded={isOpen}
              className="faq-question"
              onClick={() => toggleFaq(index)}
              type="button"
            >
              <span>{translatedQuestion}</span>
              <span className="faq-chevron" aria-hidden="true" />
            </button>
            <div className="faq-answer" id={answerId}>
              <p>{translatedAnswer}</p>
            </div>
          </article>
        )
      })}
    </div>
  )
}

function FaqSection({ t, language, navigateToFaqLibrary }) {
  const homepageFaqs = faqs.slice(0, 9)
  const labels = faqCopy[language]

  return (
    <section className="section faq-section" id="faq">
      <div className="container">
        <div className="section-heading wide">
          <h2>{t.faqTitle}</h2>
        </div>
        <FaqAccordion items={homepageFaqs} language={language} idPrefix="faq-answer" />
        {faqs.length > homepageFaqs.length && (
          <div className="faq-section-actions">
            <button className="faq-more-button" onClick={navigateToFaqLibrary} type="button">
              {labels.moreQuestions}
            </button>
          </div>
        )}
      </div>
    </section>
  )
}

function FaqLibraryPage({ language }) {
  const labels = faqCopy[language]

  return (
    <main className="article-page faq-library-page">
      <section className="container article-page-shell">
        <a className="article-back" href="/#faq">
          {labels.backToFaq}
        </a>
        <div className="faq-library-hero">
          <span className="article-kicker">LESHEN FAQ</span>
          <h1>{labels.libraryTitle}</h1>
          <p>{labels.libraryBody}</p>
        </div>
        <FaqAccordion items={faqs} language={language} idPrefix="faq-library-answer" />
      </section>
    </main>
  )
}

function BlogSection({ t, language, navigateToArticle, navigateToBlogLibrary }) {
  const allCategory = blogCategories[0]
  const labels = blogCopy[language]
  const [activeCategory, setActiveCategory] = useState(allCategory)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const featuredArticle = blogArticles.find((article) => article.featured) || blogArticles[0]
  const featuredArticleCopy = getArticleCopy(featuredArticle, language)
  const filteredArticles = useMemo(
    () =>
      blogArticles.filter((article) => {
        const matchesCategory =
          activeCategory === allCategory || article.category === activeCategory
        const articleCopy = getArticleCopy(article, language)
        const searchableText = [
          articleCopy.title,
          articleCopy.category,
          articleCopy.summary,
          ...articleCopy.tags,
        ]
          .join(' ')
          .toLowerCase()
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)

        return matchesCategory && matchesQuery
      }),
    [activeCategory, allCategory, language, normalizedQuery],
  )
  const categoryCounts = useMemo(
    () =>
      blogCategories.reduce((counts, category) => {
        counts[category] =
          category === allCategory
            ? blogArticles.length
            : blogArticles.filter((article) => article.category === category).length
        return counts
      }, {}),
    [allCategory],
  )
  const displayedArticles =
    activeCategory === allCategory ? filteredArticles.slice(0, 9) : filteredArticles
  const hasMoreArticles =
    activeCategory === allCategory && filteredArticles.length > displayedArticles.length

  function openCategory(category) {
    const nextArticle =
      category === allCategory
        ? featuredArticle
        : blogArticles.find((article) => article.category === category)

    setActiveCategory(category)
    setQuery('')

    if (!nextArticle) return

    navigateToArticle(nextArticle)
  }

  return (
    <section className="section blog-section" id="blog">
      <div className="container blog-library">
        <div className="blog-library-head">
          <div className="section-heading">
            <h2>{t.blogTitle}</h2>
            <p>{t.blogBody}</p>
          </div>
          <button
            className="blog-featured-card"
            onClick={() => navigateToArticle(featuredArticle)}
            type="button"
          >
            <span>{labels.featured}</span>
            <h3>{featuredArticleCopy.title}</h3>
            <p>{featuredArticleCopy.summary}</p>
            <div className="article-meta">
              <span>{featuredArticleCopy.category}</span>
            </div>
          </button>
        </div>

        <div className="blog-controls" aria-label="Blog search and filters">
          <label className="blog-search">
            <span>{labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              type="search"
            />
          </label>
          <div className="blog-category-list" aria-label="Blog categories">
            {blogCategories.map((category) => (
              <button
                className={category === activeCategory ? 'is-active' : ''}
                key={category}
                onClick={() => openCategory(category)}
                type="button"
              >
                <span>{getCategoryLabel(category, language)}</span>
                <strong>{categoryCounts[category]}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="blog-results-head">
          <span>
            {getCategoryLabel(activeCategory, language)} · {displayedArticles.length} /{' '}
            {filteredArticles.length} {labels.articlesCount}
          </span>
          <div className="blog-result-actions">
            {hasMoreArticles && (
              <button type="button" onClick={navigateToBlogLibrary}>
                {labels.moreContent}
              </button>
            )}
            <button
              type="button"
              onClick={() => {
                setActiveCategory(allCategory)
                setQuery('')
              }}
            >
              {labels.reset}
            </button>
          </div>
        </div>

        <div className="blog-grid">
          {displayedArticles.map((article) => {
            const articleCopy = getArticleCopy(article, language)

            return (
              <button
                className="blog-card"
                key={article.id}
                onClick={() => navigateToArticle(article)}
                type="button"
              >
                <div className="article-meta">
                  <span>{articleCopy.category}</span>
                </div>
                <h3>{articleCopy.title}</h3>
                <p>{articleCopy.summary}</p>
                <div className="article-tags">
                  {articleCopy.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
        {filteredArticles.length === 0 && (
          <div className="blog-empty">
            <h3>{labels.emptyTitle}</h3>
            <p>{labels.emptyBody}</p>
          </div>
        )}
      </div>
    </section>
  )
}

function BlogLibraryPage({ language, navigateToArticle }) {
  const allCategory = blogCategories[0]
  const labels = blogCopy[language]
  const [activeCategory, setActiveCategory] = useState(allCategory)
  const [query, setQuery] = useState('')
  const normalizedQuery = query.trim().toLowerCase()
  const filteredArticles = useMemo(
    () =>
      blogArticles.filter((article) => {
        const matchesCategory =
          activeCategory === allCategory || article.category === activeCategory
        const articleCopy = getArticleCopy(article, language)
        const searchableText = [
          articleCopy.title,
          articleCopy.category,
          articleCopy.summary,
          ...articleCopy.tags,
        ]
          .join(' ')
          .toLowerCase()
        const matchesQuery = !normalizedQuery || searchableText.includes(normalizedQuery)

        return matchesCategory && matchesQuery
      }),
    [activeCategory, allCategory, language, normalizedQuery],
  )
  const categoryCounts = useMemo(
    () =>
      blogCategories.reduce((counts, category) => {
        counts[category] =
          category === allCategory
            ? blogArticles.length
            : blogArticles.filter((article) => article.category === category).length
        return counts
      }, {}),
    [allCategory],
  )

  return (
    <main className="article-page blog-library-page">
      <section className="container article-page-shell">
        <a className="article-back" href="/#blog">
          {labels.backToBlog}
        </a>
        <div className="blog-library-hero">
          <span className="article-kicker">{labels.libraryKicker}</span>
          <h1>{labels.libraryTitle}</h1>
          <p>{labels.libraryBody}</p>
        </div>

        <div className="blog-controls" aria-label="Blog library search and filters">
          <label className="blog-search">
            <span>{labels.search}</span>
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={labels.searchPlaceholder}
              type="search"
            />
          </label>
          <div className="blog-category-list" aria-label="Blog library categories">
            {blogCategories.map((category) => (
              <button
                className={category === activeCategory ? 'is-active' : ''}
                key={category}
                onClick={() => {
                  setActiveCategory(category)
                  setQuery('')
                }}
                type="button"
              >
                <span>{getCategoryLabel(category, language)}</span>
                <strong>{categoryCounts[category]}</strong>
              </button>
            ))}
          </div>
        </div>

        <div className="blog-results-head">
          <span>
            {getCategoryLabel(activeCategory, language)} · {filteredArticles.length}{' '}
            {labels.articlesCount}
          </span>
          <button
            type="button"
            onClick={() => {
              setActiveCategory(allCategory)
              setQuery('')
            }}
          >
            {labels.reset}
          </button>
        </div>

        <div className="blog-grid">
          {filteredArticles.map((article) => {
            const articleCopy = getArticleCopy(article, language)

            return (
              <button
                className="blog-card"
                key={article.id}
                onClick={() => navigateToArticle(article)}
                type="button"
              >
                <div className="article-meta">
                  <span>{articleCopy.category}</span>
                </div>
                <h3>{articleCopy.title}</h3>
                <p>{articleCopy.summary}</p>
                <div className="article-tags">
                  {articleCopy.tags.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
              </button>
            )
          })}
        </div>
        {filteredArticles.length === 0 && (
          <div className="blog-empty">
            <h3>{labels.emptyTitle}</h3>
            <p>{labels.emptyBody}</p>
          </div>
        )}
      </section>
    </main>
  )
}

function ArticlePage({ article, language, navigateToArticle }) {
  const labels = blogCopy[language]
  const articleCopy = getArticleCopy(article, language)
  const relatedArticles = article
    ? blogArticles
        .filter((item) => item.category === article.category && item.id !== article.id)
        .slice(0, 3)
    : []

  if (!article) {
    return (
      <main className="article-page">
        <section className="container article-page-shell">
          <a className="article-back" href="/#blog">
            {labels.backToBlog}
          </a>
          <article className="article-page-card">
            <span className="article-kicker">Blog</span>
            <h1>{labels.missingTitle}</h1>
            <p className="article-lede">{labels.missingBody}</p>
          </article>
        </section>
      </main>
    )
  }

  return (
    <main className="article-page">
      <section className="container article-page-shell">
        <a className="article-back" href="/#blog">
          {labels.backToBlog}
        </a>
        <article className="article-page-card">
          <div className="article-meta">
            <span>{articleCopy.category}</span>
          </div>
          <h1>{articleCopy.title}</h1>
          <p className="article-lede">{articleCopy.summary}</p>
          <div className="article-page-content">
            {(articleCopy.content || []).map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
          <div className="article-tags">
            {articleCopy.tags.map((tag) => (
              <span key={tag}>{tag}</span>
            ))}
          </div>
        </article>

        {relatedArticles.length > 0 && (
          <section className="related-articles" aria-label={labels.relatedTitle}>
            <div className="section-heading wide">
              <h2>{labels.relatedTitle}</h2>
            </div>
            <div className="related-grid">
              {relatedArticles.map((relatedArticle) => {
                const relatedCopy = getArticleCopy(relatedArticle, language)

                return (
                  <button
                    className="related-card"
                    key={relatedArticle.id}
                    onClick={() => navigateToArticle(relatedArticle)}
                    type="button"
                  >
                    <span>{relatedCopy.category}</span>
                    <strong>{relatedCopy.title}</strong>
                    <p>{relatedCopy.summary}</p>
                  </button>
                )
              })}
            </div>
          </section>
        )}
      </section>
    </main>
  )
}

function ContactSection({ t, language }) {
  const [form, setForm] = useState(initialContactForm)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const labels =
    language === 'zh'
      ? {
          formTitle: '预约形象咨询',
          formBody: '提交后我们会根据你的城市、预算和需求说明，安排顾问与你确认方案。',
          name: '联系人',
          phone: '联系电话',
          wechat: '微信',
          city: '所在城市',
          budget: '预算区间',
          message: '需求说明',
          budgetPlaceholder: '例如：8000-12000，或按实际方案沟通',
          messagePlaceholder:
            '例如：发际线后移、头顶稀疏、希望商务自然风格、预计到店时间等。',
          submit: '提交咨询',
          submitting: '正在提交...',
          success: '已提交咨询信息，我们会尽快与你确认方案。',
          error: '提交暂时失败，信息已保存在浏览器本地，请稍后重试或直接联系乐绅。',
        }
      : {
          formTitle: 'Book an image consultation',
          formBody:
            'After submission, we will review your city, budget and needs before confirming the plan.',
          name: 'Contact name',
          phone: 'Phone',
          wechat: 'WeChat',
          city: 'City',
          budget: 'Budget range',
          message: 'Needs',
          budgetPlaceholder: 'For example: 8000-12000, or discuss after consultation',
          messagePlaceholder:
            'For example: receding hairline, thinning crown, natural business style, preferred visit time.',
          submit: 'Submit inquiry',
          submitting: 'Submitting...',
          success:
            'Inquiry submitted. We will confirm the plan with you soon.',
          error:
            'Submission failed for now. The information is saved locally in this browser.',
        }

  function updateField(event) {
    const { name, value } = event.target
    setForm((current) => ({ ...current, [name]: value }))
    if (submitStatus !== 'idle') setSubmitStatus('idle')
  }

  async function submitForm(event) {
    event.preventDefault()
    setSubmitStatus('submitting')

    const inquiry = createZohoLeadPayload(form)
    const existing = JSON.parse(localStorage.getItem('leshen_contact_inquiries') || '[]')

    localStorage.setItem('leshen_contact_inquiries', JSON.stringify([inquiry, ...existing]))

    const submitDirectlyToZoho = async () => {
      await submitZohoWebForm(inquiry)
      setForm(initialContactForm)
      setSubmitStatus('success')
    }

    try {
      if (!contactSubmissionEndpoint) {
        await submitDirectlyToZoho()
        return
      }

      const response = await fetch(contactSubmissionEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(inquiry),
      })

      const data = await response.json().catch(() => ({}))

      if (response.status === 501 && data.code === 'ZOHO_CONFIG_MISSING') {
        await submitDirectlyToZoho()
        return
      }

      if (response.status === 404) {
        await submitDirectlyToZoho()
        return
      }

      if (!response.ok || data.ok !== true) {
        throw new Error(data.message || `CRM endpoint returned ${response.status}`)
      }

      setForm(initialContactForm)
      setSubmitStatus('success')
    } catch (error) {
      console.error(error)
      setSubmitStatus('error')
    }
  }

  return (
    <section className="contact-section" id="contact">
      <div className="container contact-grid">
        <div className="contact-copy">
          <BrandMark />
          <h2>{t.finalTitle}</h2>
          <p>{t.finalBody}</p>
          <div className="contact-details">
            <span>{t.phone}</span>
            <strong>+86 19117080080</strong>
            <span>{t.address}</span>
            <strong>leshen.store</strong>
          </div>
        </div>
        <form className="contact-form" onSubmit={submitForm}>
          <div className="form-heading">
            <span>{labels.formTitle}</span>
            <p>{labels.formBody}</p>
          </div>
          <div className="form-grid">
            <label>
              <span>{labels.name}</span>
              <input
                name="name"
                value={form.name}
                onChange={updateField}
                data-zoho-field="Last_Name"
                autoComplete="name"
                required
              />
            </label>
            <label>
              <span>{labels.phone}</span>
              <input
                name="phone"
                value={form.phone}
                onChange={updateField}
                data-zoho-field="Phone"
                autoComplete="tel"
                inputMode="tel"
                required
              />
            </label>
            <label>
              <span>{labels.wechat}</span>
              <input
                name="wechat"
                value={form.wechat}
                onChange={updateField}
                data-zoho-field="Description"
                required
              />
            </label>
            <label>
              <span>{labels.city}</span>
              <input
                name="city"
                value={form.city}
                onChange={updateField}
                data-zoho-field="City"
                autoComplete="address-level2"
                required
              />
            </label>
            <label className="full-field">
              <span>{labels.budget}</span>
              <input
                name="budget"
                value={form.budget}
                onChange={updateField}
                data-zoho-field="Description"
                placeholder={labels.budgetPlaceholder}
                required
              />
            </label>
            <label className="full-field">
              <span>{labels.message}</span>
              <textarea
                name="message"
                value={form.message}
                onChange={updateField}
                data-zoho-field="Description"
                placeholder={labels.messagePlaceholder}
                rows="5"
                required
              />
            </label>
          </div>
          <button
            className="primary-cta form-submit"
            type="submit"
            disabled={submitStatus === 'submitting'}
          >
            {submitStatus === 'submitting' ? labels.submitting : labels.submit}
          </button>
          {submitStatus === 'success' && <p className="form-success">{labels.success}</p>}
          {submitStatus === 'error' && <p className="form-error">{labels.error}</p>}
        </form>
      </div>
    </section>
  )
}

function getArticleIdFromPath(pathname) {
  const normalizedPath = pathname.replace(/\/$/, '')

  if (!normalizedPath.startsWith('/blog/')) return ''

  return decodeURIComponent(normalizedPath.slice('/blog/'.length))
}

function App() {
  const [language, setLanguage] = useState(getInitialLanguage)
  const [routePath, setRoutePath] = useState(() => window.location.pathname)
  const hasPlayedOpeningRef = useRef(false)
  const t = copy[language]
  const isBlogLibrary = routePath.replace(/\/$/, '') === '/blog-library'
  const isFaqLibrary = routePath.replace(/\/$/, '') === '/faq'
  const articleId = getArticleIdFromPath(routePath)
  const activeArticle = articleId
    ? blogArticles.find((article) => article.id === articleId)
    : null
  const schema = useMemo(
    () => ({
      '@context': 'https://schema.org',
      '@type': 'Organization',
      name: 'LESHEN 乐绅',
      url: 'https://leshen.store',
      address: 'Shanghai, China',
      description: '男士高端定制假发、真人发补发与整体形象设计品牌。',
      sameAs: [],
    }),
    [],
  )

  useEffect(() => {
    function syncRoute() {
      setRoutePath(window.location.pathname)
    }

    window.addEventListener('popstate', syncRoute)
    return () => window.removeEventListener('popstate', syncRoute)
  }, [])

  useEffect(() => {
    localStorage.setItem(languageStorageKey, language)
  }, [language])

  useEffect(() => {
    if (articleId || !window.location.hash) return

    window.requestAnimationFrame(() => {
      const target = document.getElementById(window.location.hash.slice(1))
      target?.scrollIntoView({ block: 'start' })
    })
  }, [articleId])

  useLayoutEffect(() => {
    if (!articleId && !isBlogLibrary && !isFaqLibrary) return

    function scrollToPageTop() {
      window.scrollTo({ top: 0, left: 0, behavior: 'auto' })
    }

    scrollToPageTop()
    const frameId = window.requestAnimationFrame(scrollToPageTop)
    const timeoutId = window.setTimeout(scrollToPageTop, 180)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
    }
  }, [articleId, isBlogLibrary, isFaqLibrary, routePath])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      return undefined
    }

    const isStandalonePage = Boolean(articleId || isBlogLibrary || isFaqLibrary)
    const ctx = gsap.context(() => {
      const slowEase = 'expo.out'
      const isCompactMotion = window.matchMedia('(max-width: 760px)').matches
      const shouldPlayOpening =
        !isStandalonePage &&
        !hasPlayedOpeningRef.current &&
        (!window.location.hash || window.location.hash === '#home')

      if (shouldPlayOpening) {
        const heroVideoElement = document.querySelector('.hero-video')

        gsap.set('.opening-curtain', { autoAlpha: 1 })
        gsap.set('.opening-panel', { clipPath: 'inset(0% 0% 0% 0%)' })
        gsap.set('.opening-word span, .opening-word small', {
          autoAlpha: 0,
          yPercent: 130,
          scaleY: 0.55,
          transformOrigin: '50% 100%',
        })
        gsap.set('.site-header, .hero-copy p, .hero-actions, .hero-meta span', {
          autoAlpha: 0,
          y: 34,
        })
        gsap.set('.motion-title-unit', {
          autoAlpha: 0,
          yPercent: 140,
          scaleY: 0.42,
          rotationX: -18,
          filter: 'blur(12px)',
          transformOrigin: '50% 100%',
        })
        if (heroVideoElement) {
          gsap.set(heroVideoElement, {
            clipPath: 'inset(12% 0% 12% 0%)',
            scale: 1.22,
            transformOrigin: '50% 50%',
          })
        }

        const openingTimeline = gsap.timeline({
          defaults: { ease: slowEase },
        })

        openingTimeline
          .to('.opening-word span, .opening-word small', {
            autoAlpha: 1,
            yPercent: 0,
            scaleY: 1,
            duration: 1.05,
            stagger: 0.16,
          })
          .to('.opening-panel.is-left', {
            clipPath: 'inset(0% 100% 0% 0%)',
            duration: 1.35,
            ease: 'expo.inOut',
          }, '+=0.12')
          .to('.opening-panel.is-right', {
            clipPath: 'inset(0% 0% 0% 100%)',
            duration: 1.35,
            ease: 'expo.inOut',
          }, '<')
          .to('.opening-curtain', {
            autoAlpha: 0,
            duration: 0.28,
            onComplete: () => {
              hasPlayedOpeningRef.current = true
            },
          }, '-=0.22')

        if (heroVideoElement) {
          openingTimeline.to(heroVideoElement, {
            clipPath: 'inset(0% 0% 0% 0%)',
            scale: 1.04,
            duration: 1.55,
          }, '-=1.15')
        }

        openingTimeline
          .to('.motion-title-unit', {
            autoAlpha: 1,
            yPercent: 0,
            scaleY: 1,
            rotationX: 0,
            filter: 'blur(0px)',
            duration: 1.35,
            stagger: {
              each: 0.035,
              from: 'start',
            },
          }, '-=0.92')
          .to('.hero-copy p', {
            autoAlpha: 1,
            y: 0,
            duration: 1.0,
          }, '-=0.72')
          .to('.hero-actions', {
            autoAlpha: 1,
            y: 0,
            duration: 0.86,
          }, '-=0.62')
          .to('.hero-meta span', {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
            stagger: 0.12,
          }, '-=0.72')
          .to('.site-header', {
            autoAlpha: 1,
            y: 0,
            duration: 0.9,
          }, '-=0.9')
      } else {
        gsap.fromTo('.site-header', { autoAlpha: 0, y: -28 }, {
          autoAlpha: 1,
          y: 0,
          duration: 0.78,
          ease: slowEase,
        })
      }

      if (!isStandalonePage) {
        if (!isCompactMotion) {
          gsap.to('.hero-video', {
            yPercent: 16,
            scale: 1.08,
            ease: 'none',
            scrollTrigger: {
              trigger: '.hero-section',
              start: 'top top',
              end: 'bottom top',
              scrub: 1.4,
            },
          })
        }

        gsap.utils.toArray('.section, .contact-section').forEach((section) => {
          const heading = section.querySelectorAll('.section-heading h2, .contact-grid h2')
          const intro = section.querySelectorAll('.section-heading p, .contact-copy > p')
          const cards = section.querySelectorAll(
            [
              '.brand-panels > article',
              '.service-card',
              '.blog-featured-card',
              '.blog-controls',
              '.blog-results-head',
              '.blog-card',
              '.faq-item',
              '.faq-section-actions',
              '.contact-details',
              '.contact-form',
            ].join(', '),
          )

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: section,
              start: 'top 76%',
              once: true,
            },
            defaults: { ease: slowEase },
          })

          if (heading.length) {
            tl.fromTo(heading, {
              autoAlpha: 0,
              y: isCompactMotion ? 54 : 118,
              scaleY: isCompactMotion ? 0.92 : 0.68,
              scaleX: isCompactMotion ? 1 : 1.08,
              filter: isCompactMotion ? 'none' : 'blur(10px)',
              transformOrigin: '50% 100%',
            }, {
              autoAlpha: 1,
              y: 0,
              scaleY: 1,
              scaleX: 1,
              filter: isCompactMotion ? 'none' : 'blur(0px)',
              duration: isCompactMotion ? 0.72 : 1.05,
            })
          }

          if (intro.length) {
            tl.fromTo(intro, {
              autoAlpha: 0,
              y: 42,
            }, {
              autoAlpha: 1,
              y: 0,
              duration: 0.82,
            }, '-=0.62')
          }

          if (cards.length) {
            tl.fromTo(cards, {
              autoAlpha: 0,
              y: isCompactMotion ? 42 : 96,
              scale: isCompactMotion ? 0.985 : 0.94,
              clipPath: isCompactMotion ? 'none' : 'inset(18% 0% 0% 0%)',
              transformOrigin: '50% 100%',
            }, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: isCompactMotion ? 'none' : 'inset(0% 0% 0% 0%)',
              duration: isCompactMotion ? 0.66 : 1.0,
              stagger: {
                each: isCompactMotion ? 0.045 : 0.095,
                from: 'start',
              },
            }, '-=0.38')
          }
        })
      }

      if (isStandalonePage) {
        gsap
          .timeline({ defaults: { ease: slowEase } })
          .fromTo('.article-back', {
            autoAlpha: 0,
            y: 28,
          }, {
            autoAlpha: 1,
            y: 0,
            duration: 0.72,
          })
          .fromTo('.article-page-card, .blog-library-hero, .faq-library-hero', {
            autoAlpha: 0,
            y: isCompactMotion ? 48 : 96,
            scaleY: isCompactMotion ? 0.94 : 0.78,
            filter: isCompactMotion ? 'none' : 'blur(10px)',
            transformOrigin: '50% 100%',
          }, {
            autoAlpha: 1,
            y: 0,
            scaleY: 1,
            filter: isCompactMotion ? 'none' : 'blur(0px)',
            duration: isCompactMotion ? 0.76 : 1.1,
          }, '-=0.42')
          .fromTo(
            '.article-page-content p, .article-tags span, .blog-controls, .blog-results-head, .blog-card, .faq-item, .related-card',
            {
              autoAlpha: 0,
              y: isCompactMotion ? 36 : 64,
              scale: isCompactMotion ? 0.985 : 0.96,
              clipPath: isCompactMotion ? 'none' : 'inset(18% 0% 0% 0%)',
            },
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              clipPath: isCompactMotion ? 'none' : 'inset(0% 0% 0% 0%)',
              duration: isCompactMotion ? 0.62 : 0.9,
              stagger: isCompactMotion ? 0.04 : 0.08,
            },
            '-=0.48',
          )
      }
    })

    ScrollTrigger.refresh()

    return () => {
      ctx.revert()
    }
  }, [articleId, isBlogLibrary, isFaqLibrary, language, routePath])

  function navigateToArticle(article) {
    if (!article) return

    window.history.pushState(null, '', `/blog/${encodeURIComponent(article.id)}`)
    setRoutePath(window.location.pathname)
  }

  function navigateToBlogLibrary() {
    window.history.pushState(null, '', '/blog-library')
    setRoutePath(window.location.pathname)
  }

  function navigateToFaqLibrary() {
    window.history.pushState(null, '', '/faq')
    setRoutePath(window.location.pathname)
  }

  if (isBlogLibrary) {
    return (
      <>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <BlogLibraryPage language={language} navigateToArticle={navigateToArticle} />
      </>
    )
  }

  if (isFaqLibrary) {
    return (
      <>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <FaqLibraryPage language={language} />
      </>
    )
  }

  if (articleId) {
    return (
      <>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <ArticlePage
          article={activeArticle}
          language={language}
          navigateToArticle={navigateToArticle}
        />
      </>
    )
  }

  return (
    <>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
      <OpeningAnimationLayer />
      <Header language={language} setLanguage={setLanguage} t={t} />
      <main>
        <Hero t={t} />
        <WhatSection t={t} language={language} />
        <ServicesSection t={t} language={language} />
        <BlogSection
          t={t}
          language={language}
          navigateToArticle={navigateToArticle}
          navigateToBlogLibrary={navigateToBlogLibrary}
        />
        <FaqSection
          t={t}
          language={language}
          navigateToFaqLibrary={navigateToFaqLibrary}
        />
        <ContactSection t={t} language={language} />
      </main>
    </>
  )
}

export default App
