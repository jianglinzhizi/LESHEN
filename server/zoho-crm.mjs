const DEFAULT_ACCOUNTS_DOMAIN = 'https://accounts.zoho.com.cn'
const DEFAULT_API_DOMAIN = 'https://www.zohoapis.com.cn'

function getZohoConfig(env = process.env) {
  const config = {
    accountsDomain: env.ZOHO_ACCOUNTS_DOMAIN || DEFAULT_ACCOUNTS_DOMAIN,
    apiDomain: env.ZOHO_API_DOMAIN || DEFAULT_API_DOMAIN,
    clientId: env.ZOHO_CLIENT_ID,
    clientSecret: env.ZOHO_CLIENT_SECRET,
    refreshToken: env.ZOHO_REFRESH_TOKEN,
  }

  const missing = ['clientId', 'clientSecret', 'refreshToken'].filter((key) => !config[key])

  return { config, missing }
}

function safeString(value) {
  return typeof value === 'string' ? value.trim() : ''
}

export function normalizeZohoLeadPayload(body) {
  const rawFields = body?.rawFields || {}
  const incomingLead = body?.zohoLead || {}
  const contactName = safeString(rawFields.contactName || incomingLead.Last_Name)
  const phone = safeString(rawFields.phone || incomingLead.Phone)
  const city = safeString(rawFields.city || incomingLead.City)
  const wechat = safeString(rawFields.wechat)
  const budget = safeString(rawFields.budget)
  const requirement = safeString(rawFields.requirement || incomingLead.Description)

  if (!contactName || !phone) {
    const error = new Error('联系人和联系电话是必填项')
    error.statusCode = 400
    error.code = 'INVALID_LEAD_PAYLOAD'
    throw error
  }

  const description = [
    wechat && `微信：${wechat}`,
    budget && `预算区间：${budget}`,
    city && `所在城市：${city}`,
    requirement && '',
    requirement && '需求说明：',
    requirement,
  ]
    .filter(Boolean)
    .join('\n')

  return {
    Last_Name: contactName,
    Phone: phone,
    City: city,
    Lead_Source: incomingLead.Lead_Source || 'Website',
    Company: incomingLead.Company || '个人客户',
    Description: description || incomingLead.Description || '官网表单咨询',
  }
}

async function getAccessToken(env = process.env) {
  const { config, missing } = getZohoConfig(env)

  if (missing.length > 0) {
    const error = new Error(`Missing Zoho config: ${missing.join(', ')}`)
    error.statusCode = 501
    error.code = 'ZOHO_CONFIG_MISSING'
    throw error
  }

  const tokenUrl = new URL('/oauth/v2/token', config.accountsDomain)
  tokenUrl.searchParams.set('refresh_token', config.refreshToken)
  tokenUrl.searchParams.set('client_id', config.clientId)
  tokenUrl.searchParams.set('client_secret', config.clientSecret)
  tokenUrl.searchParams.set('grant_type', 'refresh_token')

  const response = await fetch(tokenUrl, { method: 'POST' })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || !data.access_token) {
    const error = new Error(data.error || 'Failed to get Zoho access token')
    error.statusCode = response.status || 502
    error.code = 'ZOHO_TOKEN_ERROR'
    error.details = data
    throw error
  }

  return { accessToken: data.access_token, apiDomain: config.apiDomain }
}

export async function createZohoLead(body, env = process.env) {
  const record = normalizeZohoLeadPayload(body)
  const { accessToken, apiDomain } = await getAccessToken(env)
  const response = await fetch(`${apiDomain}/crm/v8/Leads`, {
    method: 'POST',
    headers: {
      Authorization: `Zoho-oauthtoken ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      data: [record],
      trigger: ['workflow'],
    }),
  })
  const data = await response.json().catch(() => ({}))

  if (!response.ok || data?.data?.[0]?.status === 'error') {
    const error = new Error(data?.data?.[0]?.message || 'Failed to create Zoho lead')
    error.statusCode = response.status || 502
    error.code = data?.data?.[0]?.code || 'ZOHO_CREATE_LEAD_ERROR'
    error.details = data
    throw error
  }

  return {
    ok: true,
    provider: 'zoho-crm',
    record,
    response: data,
  }
}

export function toPublicError(error) {
  return {
    ok: false,
    code: error.code || 'ZOHO_LEAD_ERROR',
    message: error.message || 'Zoho CRM submission failed',
    details: error.details,
  }
}
