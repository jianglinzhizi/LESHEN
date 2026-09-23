import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { blogArticles, blogCategories, blogCategoryLabels } from './content/blog'
import {
  channelCatalog,
  createChannelTrackingPayload,
  getChannelActions,
} from './channelData'
import './App.css'

const heroVideo = 'https://assets.mixkit.co/videos/47577/47577-720.mp4'

gsap.registerPlugin(ScrollTrigger)

const copy = {
  zh: {
    nav: ['品牌', '服务', '博客', 'FAQ', '联系'],
    channels: '官方渠道',
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
    channels: 'Channels',
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
const privacyPolicyVersion = '2026-09-20'
const personalInformationHandler = '都是朋友（上海）假发造型设计有限责任公司'
const legalDocumentOrder = ['privacy', 'collection', 'cookies', 'consultation']

const legalDocuments = {
  zh: {
    privacy: {
      title: '《隐私政策》',
      summary:
        '本政策说明乐绅在官网咨询与网站运营过程中如何收集、使用、存储和保护个人信息。',
      sections: [
        {
          heading: '1. 我们是谁',
          paragraphs: [
            `个人信息处理者：${personalInformationHandler}（品牌：LESHEN 乐绅）。`,
            '联系方式：+86 19117080080（电话 / 微信）。如您对个人信息处理有疑问，或希望行使查阅、复制、更正、删除或撤回同意等权利，可通过上述方式联系我们。',
          ],
        },
        {
          heading: '2. 我们处理的信息',
          items: [
            '咨询表单信息：联系人、联系电话、微信、所在城市、预算区间和需求说明。',
            '您主动提供的敏感个人信息：需求说明中可能包含脱发情况、健康状况或相关图像。请勿填写与咨询无关的身份证号、金融账户等信息。',
            '网站访问与统计信息：IP 地址、设备与浏览器类型、访问时间、页面浏览与交互事件等。',
          ],
        },
        {
          heading: '3. 处理目的和方式',
          items: [
            '与您联系，了解需求，评估定制方案，安排到店咨询与后续服务。',
            '保障网站运行、排查故障、统计页面访问表现并改善用户体验。',
            '咨询表单信息会传送至 Zoho CRM 用于客户线索管理，并会在当前浏览器的本地存储中保留副本，以便在提交失败时辅助恢复。',
          ],
        },
        {
          heading: '4. 对外提供与委托处理',
          paragraphs: [
            '我们不售卖您的个人信息。为完成客户咨询和网站统计，我们会使用 Zoho CRM、Google Analytics 和百度统计等服务。相关服务提供方会在提供服务所必需的范围内处理信息，并受其自身隐私规则约束。',
          ],
        },
        {
          heading: '5. 保存期限与安全',
          paragraphs: [
            '我们仅在完成咨询、提供服务、处理争议或履行法定义务所需的最短期限内保存个人信息；浏览器本地副本会保留至您清除本网站的浏览数据。期限届满后，我们将删除或匿名化处理，法律法规另有规定的除外。',
            '我们会采取与信息规模和风险相匹配的访问控制、传输保护和内部管理措施，但任何网络传输都无法承诺绝对安全。',
          ],
        },
        {
          heading: '6. 您的权利与未成年人保护',
          paragraphs: [
            '您可要求查阅、复制、更正、补充、删除或限制处理个人信息，也可撤回同意。撤回不影响撤回前已开展的合法处理活动。我们的服务主要面向成年人；不满十四周岁的未成年人请由监护人联系我们并提供同意。',
          ],
        },
        {
          heading: '7. 政策更新',
          paragraphs: [
            `生效及最近更新日期：${privacyPolicyVersion}。如处理目的、方式或信息类型发生重要变更，我们将更新本政策，并在依法需要时重新征得同意。`,
          ],
        },
      ],
    },
    collection: {
      title: '《个人信息收集说明》',
      summary: '以下说明帮助您快速了解咨询表单和网站访问所涉及的信息。',
      sections: [
        {
          heading: '咨询表单',
          items: [
            '联系人、电话、微信：用于识别咨询人并回复需求。',
            '所在城市：用于判断到店和服务安排。',
            '预算区间：用于筛选适合的方案范围。',
            '需求说明：用于了解发际线、发量、风格、到店时间等咨询需求。',
            '脱发或健康相关信息可能属于敏感个人信息；我们仅在您单独同意后，用于评估咨询方案。',
          ],
        },
        {
          heading: '自动收集信息',
          items: [
            '统计技术可收集 IP 地址、大致地区、设备、操作系统、浏览器、来源页面、访问时间和页面交互事件。',
            '浏览器本地存储用于保存语言偏好和咨询提交副本，数据留在您当前使用的浏览器中，直至您清除网站数据。',
          ],
        },
        {
          heading: '处理与联系',
          paragraphs: [
            '咨询记录提交至 Zoho CRM，由乐绅顾问用于跟进服务。我们不会因您拒绝提供非必要信息而拒绝与信息无关的服务。权利请求请联系 +86 19117080080。',
          ],
        },
      ],
    },
    cookies: {
      title: 'Cookie / 统计技术说明',
      summary: '本网站使用浏览器存储与第三方统计技术保持基本功能、了解网站使用情况并改进内容。',
      sections: [
        {
          heading: '我们使用的技术',
          items: [
            '必要的浏览器本地存储：记住中英文语言偏好，并在咨询提交失败时保存输入副本。',
            'Google Analytics（识别码 G-EMQF619KR9）：统计页面访问、来源、设备类型与交互事件。',
            '百度统计（识别码 e0640b03f7c51c45399f306de123e5d7）：统计页面访问与使用情况。',
          ],
        },
        {
          heading: '可能处理的数据',
          paragraphs: [
            '包括 IP 地址、Cookie 或类似标识符、设备与浏览器信息、来源地址、访问时间、页面浏览和点击事件。我们不使用这些统计数据对您作出具有重大影响的自动化决定。',
          ],
        },
        {
          heading: '如何管理',
          paragraphs: [
            '您可在浏览器中删除或限制 Cookie 和网站数据，也可使用浏览器的“防止跨站跟踪”或类似功能。屏蔽统计技术不影响浏览网站的核心内容，但可能使语言偏好无法持久保存。',
          ],
        },
      ],
    },
    consultation: {
      title: '《咨询表单个人信息同意》',
      summary: '请在提交表单前阅读。勾选同意不影响您之后撤回同意或行使其他个人信息权利。',
      sections: [
        {
          heading: '一般个人信息同意',
          paragraphs: [
            `我同意 ${personalInformationHandler} 为联系我、了解需求、评估定制方案、安排咨询及后续服务，处理我填写的联系人、电话、微信、城市、预算和需求说明，并将记录提交至 Zoho CRM 进行线索管理。`,
          ],
        },
        {
          heading: '敏感个人信息单独同意',
          paragraphs: [
            '如我在需求说明中主动填写脱发、健康状况或其他健康相关信息，我知悉该类信息一旦泄露或被非法使用，可能对人身、财产或人格尊严造成影响；我单独同意乐绅仅为评估咨询方案而处理这些信息。',
          ],
        },
        {
          heading: '撤回与联系',
          paragraphs: [
            '我可通过 +86 19117080080 撤回同意，或申请查阅、更正、删除信息。撤回同意不影响撤回前基于同意已进行的合法处理。',
          ],
        },
      ],
    },
  },
}

legalDocuments.en = {
  privacy: {
    title: 'Privacy Policy',
    summary: 'This policy explains how LESHEN handles personal information through this website and its consultation service.',
    sections: [
      { heading: 'Who handles your information', paragraphs: [`Controller: ${personalInformationHandler} (LESHEN). Contact: +86 19117080080 by phone or WeChat.`] },
      { heading: 'Information and purposes', items: ['Consultation details: name, phone number, WeChat, city, budget and needs, used to respond and prepare a service plan.', 'Hair-loss or health information you voluntarily provide may be sensitive personal information and is processed only with separate consent.', 'Visit data such as IP address, device, browser, visit time and page interactions is used to operate and improve the website.'] },
      { heading: 'Storage and service providers', paragraphs: ['Consultation records are sent to Zoho CRM and a recovery copy may be kept in this browser. Google Analytics and Baidu Analytics support website statistics. We do not sell personal information. Information is kept only for the shortest period needed for consultation, service, disputes or legal obligations, then deleted or anonymized unless law requires otherwise.'] },
      { heading: 'Your rights', paragraphs: ['You may request access, copying, correction, deletion, restriction or withdrawal of consent by contacting +86 19117080080. Withdrawal does not affect lawful processing completed before withdrawal. The service is intended primarily for adults; children under 14 should ask a guardian to contact us.'] },
      { heading: 'Updates', paragraphs: [`Effective and last updated: ${privacyPolicyVersion}. Material changes will be announced here and renewed consent will be obtained where required.`] },
    ],
  },
  collection: {
    title: 'Personal Information Collection Notice',
    summary: 'A concise explanation of the information involved when you browse the site or submit a consultation.',
    sections: [
      { heading: 'Consultation form', items: ['Name, phone and WeChat: identify and reply to you.', 'City: plan an in-person consultation and service availability.', 'Budget: identify a suitable service range.', 'Needs: understand hairline, density, style and preferred visit time.', 'Voluntary hair-loss or health information is used only to assess a consultation plan with separate consent.'] },
      { heading: 'Automatic collection', items: ['Analytics may collect IP address, general region, device, operating system, browser, referring page, visit time and interaction events.', 'Local storage remembers language preference and keeps a consultation recovery copy until you clear this site’s browser data.'] },
      { heading: 'Contact', paragraphs: ['Consultation records are sent to Zoho CRM for follow-up. Contact +86 19117080080 to exercise your information rights.'] },
    ],
  },
  cookies: {
    title: 'Cookie / Analytics Notice',
    summary: 'This site uses browser storage and third-party analytics to provide basic functions and understand site usage.',
    sections: [
      { heading: 'Technologies', items: ['Local storage remembers language preference and a consultation recovery copy.', 'Google Analytics (G-EMQF619KR9) measures visits, sources, devices and interaction events.', 'Baidu Analytics (e0640b03f7c51c45399f306de123e5d7) measures page visits and usage.'] },
      { heading: 'Data and controls', paragraphs: ['These technologies may process IP address, cookie or similar identifiers, device and browser data, referrer, visit time and page events. We do not use analytics to make automated decisions with significant effects. You can delete or restrict cookies and site data in your browser; blocking analytics does not prevent access to the site’s core content.'] },
    ],
  },
  consultation: {
    title: 'Consultation Form Personal Information Consent',
    summary: 'Please read before submitting. You may later withdraw consent or exercise other personal information rights.',
    sections: [
      { heading: 'General consent', paragraphs: [`I consent to ${personalInformationHandler} processing the name, phone, WeChat, city, budget and needs I enter, and sending the record to Zoho CRM, to contact me, assess a custom plan and arrange consultation and follow-up service.`] },
      { heading: 'Separate consent for sensitive information', paragraphs: ['If I voluntarily provide hair-loss, health or other health-related information, I understand that misuse or disclosure may affect my personal or property security or dignity, and I separately consent to its use only for assessing my consultation plan.'] },
      { heading: 'Withdrawal and contact', paragraphs: ['I may contact +86 19117080080 to withdraw consent or request access, correction or deletion. Withdrawal does not affect lawful processing before withdrawal.'] },
    ],
  },
}

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
        <a href="/channels">
          <span className="channels-label-full">{t.channels}</span>
          <span className="channels-label-compact">{language === 'zh' ? '渠道' : 'Shop'}</span>
        </a>
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

function ChannelHubPage({ language }) {
  const [selectedPoster, setSelectedPoster] = useState(null)
  const [copyStatus, setCopyStatus] = useState({ channel: '', state: 'idle' })
  const closeButtonRef = useRef(null)
  const labels =
    language === 'zh'
      ? {
          back: '返回首页',
          kicker: 'LESHEN · OFFICIAL CHANNELS',
          title: '乐绅官方渠道',
          intro: '选择您常用的平台，查看商品、预约服务或了解门店。所有入口均由乐绅官网统一整理。',
          open: '打开店铺',
          copy: '复制小程序口令',
          copied: '已复制，请打开对应 App',
          copyError: '复制失败，请长按下方口令复制',
          viewPoster: '查看扫码图',
          miniProgram: '小程序口令',
          posterHint: '点击查看完整扫码图',
          noPoster: '美',
          closePoster: '关闭扫码图',
          saveHint: '长按或保存图片，再在对应 App 中扫一扫。',
          descriptions: {
            taobao: '购买乐绅假发洗护、胶片等日常护理用品。',
            douyin: '查看乐绅产品、佩戴相关内容与抖音店铺。',
            dianping: '查看乐绅男士高端假发定制（静安店）详情与用户评价。',
            meituan: '通过美团小程序查看门店服务与团购信息。',
          },
        }
      : {
          back: 'Back to home',
          kicker: 'LESHEN · OFFICIAL CHANNELS',
          title: 'LESHEN official channels',
          intro: 'Choose your preferred platform to shop, book a service, or learn more about our Shanghai studio.',
          open: 'Open store',
          copy: 'Copy mini-program code',
          copied: 'Copied. Open the corresponding app to continue.',
          copyError: 'Copy failed. Press and hold the code below to copy it.',
          viewPoster: 'View QR poster',
          miniProgram: 'Mini-program code',
          posterHint: 'Open the complete QR poster',
          noPoster: '美',
          closePoster: 'Close QR poster',
          saveHint: 'Press and hold or save this image, then scan it in the corresponding app.',
          descriptions: {
            taobao: 'Shop LESHEN hair-system care, tape, and everyday maintenance products.',
            douyin: 'Explore LESHEN products, wearing tips, and our Douyin store.',
            dianping: 'View our Jing\'an studio, service details, and customer reviews on Dianping.',
            meituan: 'Open the Meituan mini program for store services and available offers.',
          },
        }

  useEffect(() => {
    if (!selectedPoster) return undefined

    const previousOverflow = document.body.style.overflow

    function closeOnEscape(event) {
      if (event.key === 'Escape') setSelectedPoster(null)
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedPoster])

  function trackChannel(channelId, action) {
    const payload = createChannelTrackingPayload(channelId, action)

    window.gtag?.('event', payload.event, {
      channel: payload.channel,
      action: payload.action,
    })
    window._hmt?.push(['_trackEvent', 'channels', payload.action, payload.channel])
  }

  async function copyMiniProgramToken(channel) {
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(channel.miniProgramToken)
      } else {
        const textArea = document.createElement('textarea')
        textArea.value = channel.miniProgramToken
        textArea.setAttribute('readonly', '')
        textArea.style.position = 'fixed'
        textArea.style.opacity = '0'
        document.body.appendChild(textArea)
        textArea.select()
        const copied = document.execCommand('copy')
        textArea.remove()
        if (!copied) throw new Error('Copy command was not accepted')
      }

      setCopyStatus({ channel: channel.id, state: 'success' })
      trackChannel(channel.id, 'copy_mini_program')
    } catch {
      setCopyStatus({ channel: channel.id, state: 'error' })
    }
  }

  function openPoster(channel) {
    setSelectedPoster(channel)
    trackChannel(channel.id, 'view_poster')
  }

  return (
    <main className="channels-page">
      <section className="container channels-shell">
        <a className="article-back" href="/#home">
          {labels.back}
        </a>
        <header className="channels-hero">
          <span className="article-kicker">{labels.kicker}</span>
          <h1>{labels.title}</h1>
          <p>{labels.intro}</p>
        </header>

        <div className="channel-grid">
          {channelCatalog.map((channel, index) => {
            const actions = getChannelActions(channel.id)
            const hasExternalLink = actions.some(({ type }) => type === 'external')
            const hasMiniProgram = actions.some(({ type }) => type === 'miniProgram')
            const feedback = copyStatus.channel === channel.id ? copyStatus.state : 'idle'

            return (
              <article
                className={`channel-card channel-card--${channel.theme}`}
                key={channel.id}
              >
                <div className="channel-card-copy">
                  <div className="channel-card-heading">
                    <span className="channel-card-index">0{index + 1}</span>
                    <span className="channel-card-mark" aria-hidden="true">
                      {channel.name.slice(0, 1)}
                    </span>
                  </div>
                  <span className="channel-card-en">{channel.englishName}</span>
                  <h2>{channel.name}</h2>
                  <p>{labels.descriptions[channel.id]}</p>

                  {hasMiniProgram ? (
                    <div className="channel-token">
                      <span>{labels.miniProgram}</span>
                      <code>{channel.miniProgramToken}</code>
                    </div>
                  ) : null}

                  <div className="channel-actions">
                    {hasExternalLink ? (
                      <a
                        className="channel-primary"
                        href={channel.webUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => trackChannel(channel.id, 'open_store')}
                      >
                        {labels.open}
                        <span aria-hidden="true">↗</span>
                      </a>
                    ) : null}
                    {hasMiniProgram ? (
                      <button
                        className="channel-primary"
                        type="button"
                        onClick={() => copyMiniProgramToken(channel)}
                      >
                        {labels.copy}
                      </button>
                    ) : null}
                    {channel.poster ? (
                      <button
                        className="channel-secondary"
                        type="button"
                        onClick={() => openPoster(channel)}
                      >
                        {labels.viewPoster}
                      </button>
                    ) : null}
                  </div>

                  <p className={`channel-feedback is-${feedback}`} aria-live="polite">
                    {feedback === 'success'
                      ? labels.copied
                      : feedback === 'error'
                        ? labels.copyError
                        : '\u00a0'}
                  </p>
                </div>

                {channel.poster ? (
                  <button
                    className="channel-poster-button"
                    type="button"
                    onClick={() => openPoster(channel)}
                    aria-label={`${labels.viewPoster}：${channel.name}`}
                  >
                    <img src={channel.poster} alt={`${channel.name}${labels.viewPoster}`} />
                    <span>{labels.posterHint}</span>
                  </button>
                ) : (
                  <div className="channel-placeholder" aria-hidden="true">
                    <span>{labels.noPoster}</span>
                    <small>MEITUAN MINI PROGRAM</small>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      </section>

      {selectedPoster ? (
        <div
          className="poster-modal-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) setSelectedPoster(null)
          }}
        >
          <section
            className="poster-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="poster-modal-title"
          >
            <header>
              <div>
                <span>LESHEN · {selectedPoster.englishName}</span>
                <h2 id="poster-modal-title">{selectedPoster.name}</h2>
              </div>
              <button
                ref={closeButtonRef}
                type="button"
                onClick={() => setSelectedPoster(null)}
                aria-label={labels.closePoster}
              >
                ×
              </button>
            </header>
            <div className="poster-modal-media">
              <img src={selectedPoster.poster} alt={`${selectedPoster.name}${labels.viewPoster}`} />
            </div>
            <p>{labels.saveHint}</p>
          </section>
        </div>
      ) : null}
    </main>
  )
}

function LegalModal({ documentId, language, onClose }) {
  const closeButtonRef = useRef(null)
  const legalDocument = documentId ? legalDocuments[language][documentId] : null

  useEffect(() => {
    if (!legalDocument) return undefined

    const previousOverflow = document.body.style.overflow

    function closeOnEscape(event) {
      if (event.key === 'Escape') onClose()
    }

    document.body.style.overflow = 'hidden'
    window.addEventListener('keydown', closeOnEscape)
    closeButtonRef.current?.focus()

    return () => {
      document.body.style.overflow = previousOverflow
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [legalDocument, onClose])

  if (!legalDocument) return null

  return (
    <div
      className="legal-modal-backdrop"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
    >
      <section
        className="legal-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="legal-modal-title"
      >
        <header className="legal-modal-header">
          <div>
            <span>LESHEN · LEGAL</span>
            <h2 id="legal-modal-title">{legalDocument.title}</h2>
          </div>
          <button
            className="legal-modal-close"
            type="button"
            onClick={onClose}
            ref={closeButtonRef}
            aria-label={language === 'zh' ? '关闭说明' : 'Close notice'}
          >
            ×
          </button>
        </header>
        <div className="legal-modal-body">
          <p className="legal-summary">{legalDocument.summary}</p>
          {legalDocument.sections.map((section) => (
            <section className="legal-section" key={section.heading}>
              <h3>{section.heading}</h3>
              {section.paragraphs?.map((paragraph) => (
                <p key={paragraph}>{paragraph}</p>
              ))}
              {section.items ? (
                <ul>
                  {section.items.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </section>
          ))}
        </div>
      </section>
    </div>
  )
}

function LegalFooter({ language, onOpen }) {
  const documents = legalDocuments[language]

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <BrandMark />
          <p>
            {language === 'zh'
              ? `${personalInformationHandler} · 上海`
              : `${personalInformationHandler} · Shanghai`}
          </p>
          <a className="footer-channel-link" href="/channels">
            {language === 'zh' ? '进入乐绅官方渠道' : 'Explore LESHEN official channels'}
            <span aria-hidden="true">↗</span>
          </a>
        </div>
        <nav className="legal-links" aria-label={language === 'zh' ? '法律与隐私' : 'Legal and privacy'}>
          {legalDocumentOrder.map((documentId) => (
            <button type="button" key={documentId} onClick={() => onOpen(documentId)}>
              {documents[documentId].title}
            </button>
          ))}
        </nav>
        <p className="footer-meta">
          © {new Date().getFullYear()} LESHEN. {language === 'zh' ? '保留所有权利。' : 'All rights reserved.'}
        </p>
      </div>
    </footer>
  )
}

function LegalLayer({ language, activeDocument, onOpen, onClose }) {
  return (
    <>
      <LegalFooter language={language} onOpen={onOpen} />
      <LegalModal documentId={activeDocument} language={language} onClose={onClose} />
    </>
  )
}

function LegalLinkButton({ children, documentId, onOpen }) {
  return (
    <button className="inline-legal-link" type="button" onClick={() => onOpen(documentId)}>
      {children}
    </button>
  )
}

function ContactSection({ t, language, onOpenLegal }) {
  const [form, setForm] = useState(initialContactForm)
  const [submitStatus, setSubmitStatus] = useState('idle')
  const [consents, setConsents] = useState({ privacy: false, sensitive: false })
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
          privacyBefore: '我已阅读并同意',
          privacyJoin: '、',
          sensitiveConsent:
            '我单独同意乐绅为评估咨询方案，处理我主动提交的脱发情况等健康相关敏感个人信息。',
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
          privacyBefore: 'I have read and agree to the',
          privacyJoin: ', ',
          sensitiveConsent:
            'I separately consent to LESHEN processing hair-loss or other health-related sensitive information I voluntarily provide, solely to assess my consultation plan.',
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
      setConsents({ privacy: false, sensitive: false })
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
      setConsents({ privacy: false, sensitive: false })
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
          <div className="consent-list">
            <div className="consent-row">
              <input
                id="privacy-consent"
                name="privacyConsent"
                type="checkbox"
                checked={consents.privacy}
                onChange={(event) => {
                  setConsents((current) => ({ ...current, privacy: event.target.checked }))
                  if (submitStatus !== 'idle') setSubmitStatus('idle')
                }}
                required
              />
              <label htmlFor="privacy-consent">
                {labels.privacyBefore}{' '}
                <LegalLinkButton documentId="privacy" onOpen={onOpenLegal}>
                  {legalDocuments[language].privacy.title}
                </LegalLinkButton>
                {labels.privacyJoin}
                <LegalLinkButton documentId="collection" onOpen={onOpenLegal}>
                  {legalDocuments[language].collection.title}
                </LegalLinkButton>
                {labels.privacyJoin}
                <LegalLinkButton documentId="consultation" onOpen={onOpenLegal}>
                  {legalDocuments[language].consultation.title}
                </LegalLinkButton>
              </label>
            </div>
            <div className="consent-row">
              <input
                id="sensitive-consent"
                name="sensitiveConsent"
                type="checkbox"
                checked={consents.sensitive}
                onChange={(event) => {
                  setConsents((current) => ({ ...current, sensitive: event.target.checked }))
                  if (submitStatus !== 'idle') setSubmitStatus('idle')
                }}
                required
              />
              <label htmlFor="sensitive-consent">{labels.sensitiveConsent}</label>
            </div>
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
  const [activeLegalDocument, setActiveLegalDocument] = useState(null)
  const hasPlayedOpeningRef = useRef(false)
  const t = copy[language]
  const isBlogLibrary = routePath.replace(/\/$/, '') === '/blog-library'
  const isFaqLibrary = routePath.replace(/\/$/, '') === '/faq'
  const isChannelsPage = routePath.replace(/\/$/, '') === '/channels'
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
    if (!articleId && !isBlogLibrary && !isFaqLibrary && !isChannelsPage) return

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
  }, [articleId, isBlogLibrary, isChannelsPage, isFaqLibrary, routePath])

  useLayoutEffect(() => {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (reduceMotion) {
      ScrollTrigger.getAll().forEach((trigger) => trigger.kill())
      return undefined
    }

    const isStandalonePage = Boolean(
      articleId || isBlogLibrary || isFaqLibrary || isChannelsPage,
    )
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
          .fromTo('.article-page-card, .blog-library-hero, .faq-library-hero, .channels-hero', {
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
            '.article-page-content p, .article-tags span, .blog-controls, .blog-results-head, .blog-card, .faq-item, .related-card, .channel-card',
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
  }, [articleId, isBlogLibrary, isChannelsPage, isFaqLibrary, language, routePath])

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
        <LegalLayer
          language={language}
          activeDocument={activeLegalDocument}
          onOpen={setActiveLegalDocument}
          onClose={() => setActiveLegalDocument(null)}
        />
      </>
    )
  }

  if (isFaqLibrary) {
    return (
      <>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <FaqLibraryPage language={language} />
        <LegalLayer
          language={language}
          activeDocument={activeLegalDocument}
          onOpen={setActiveLegalDocument}
          onClose={() => setActiveLegalDocument(null)}
        />
      </>
    )
  }

  if (isChannelsPage) {
    return (
      <>
        <script type="application/ld+json">{JSON.stringify(schema)}</script>
        <Header language={language} setLanguage={setLanguage} t={t} />
        <ChannelHubPage language={language} />
        <LegalLayer
          language={language}
          activeDocument={activeLegalDocument}
          onOpen={setActiveLegalDocument}
          onClose={() => setActiveLegalDocument(null)}
        />
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
        <LegalLayer
          language={language}
          activeDocument={activeLegalDocument}
          onOpen={setActiveLegalDocument}
          onClose={() => setActiveLegalDocument(null)}
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
        <ContactSection
          t={t}
          language={language}
          onOpenLegal={setActiveLegalDocument}
        />
      </main>
      <LegalLayer
        language={language}
        activeDocument={activeLegalDocument}
        onOpen={setActiveLegalDocument}
        onClose={() => setActiveLegalDocument(null)}
      />
    </>
  )
}

export default App
