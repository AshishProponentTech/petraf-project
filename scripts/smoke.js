const https = require('https')
const http = require('http')
const { URL } = require('url')

const base = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'
const tenant = process.env.NEXT_PUBLIC_TENANT_ID || '550e8400-e29b-41d4-a716-446655440000'

function doRequest(path, method = 'GET', body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(path, base)
      const lib = url.protocol === 'https:' ? https : http
      const opts = {
        hostname: url.hostname,
        port: url.port || (url.protocol === 'https:' ? 443 : 80),
        path: url.pathname + url.search,
        method,
        headers: { 'X-Tenant-ID': tenant, ...headers },
      }

      const req = lib.request(opts, (res) => {
        let data = ''
        res.on('data', (chunk) => (data += chunk))
        res.on('end', () => {
          try {
            const parsed = data ? JSON.parse(data) : null
            resolve({ status: res.statusCode, body: parsed })
          } catch (err) {
            resolve({ status: res.statusCode, body: data })
          }
        })
      })

      req.on('error', (e) => reject(e))

      if (body) req.write(JSON.stringify(body))
      req.end()
    } catch (err) {
      reject(err)
    }
  })
}

async function run() {
  try {
    console.log('Using API base:', base)

    const h = await doRequest('/api/health')
    console.log('/api/health', h.status)
    console.log('health:', h.body)

  // Some backends require tenant context in the request body as a fallback.
  const create = await doRequest('/api/session/create', 'POST', { tenant_id: tenant })
    console.log('/api/session/create', create.status)
    console.log('create session response:', create.body)

    process.exit(0)
  } catch (err) {
    console.error('Smoke test failed:', err)
    process.exit(2)
  }
}

run()
