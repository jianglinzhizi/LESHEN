import { createZohoLead, toPublicError } from '../server/zoho-crm.mjs'

function parseBody(req) {
  if (!req.body) return {}
  if (typeof req.body === 'string') return JSON.parse(req.body)
  return req.body
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    res.status(405).json({ ok: false, code: 'METHOD_NOT_ALLOWED' })
    return
  }

  try {
    const result = await createZohoLead(parseBody(req))
    res.status(200).json(result)
  } catch (error) {
    res.status(error.statusCode || 500).json(toPublicError(error))
  }
}
