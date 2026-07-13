import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { createZohoLead, toPublicError } from './server/zoho-crm.mjs'

function readJsonBody(req) {
  return new Promise((resolve, reject) => {
    let raw = ''
    req.on('data', (chunk) => {
      raw += chunk
    })
    req.on('end', () => {
      try {
        resolve(raw ? JSON.parse(raw) : {})
      } catch (error) {
        reject(error)
      }
    })
    req.on('error', reject)
  })
}

function zohoLeadDevApi() {
  return {
    name: 'leshen-zoho-lead-dev-api',
    configureServer(server) {
      server.middlewares.use('/api/zoho-lead', async (req, res, next) => {
        if (req.method !== 'POST') {
          next()
          return
        }

        try {
          const body = await readJsonBody(req)
          const result = await createZohoLead(body)
          res.statusCode = 200
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(result))
        } catch (error) {
          res.statusCode = error.statusCode || 500
          res.setHeader('Content-Type', 'application/json')
          res.end(JSON.stringify(toPublicError(error)))
        }
      })
    },
  }
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), zohoLeadDevApi()],
})
