#!/usr/bin/env node
'use strict'

const fs    = require('fs')
const path  = require('path')
const https = require('https')

const DATA_FILE  = path.join(__dirname, '../src/data/abnormalities.json')
const IMG_DIR    = path.join(__dirname, '../public/images/abnormalities')
const WIKI_BASE  = 'https://lobotomycorporation.wiki.gg'

if (!fs.existsSync(IMG_DIR)) fs.mkdirSync(IMG_DIR, { recursive: true })

const HEADERS = {
  'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
  'Accept-Language': 'en-US,en;q=0.5',
  'Referer': 'https://lobotomycorporation.wiki.gg/',
}

function toPascalCase(name) {
  return name
    .replace(/['']/g, '')
    .replace(/[^a-zA-Z0-9\s]/g, ' ')
    .split(/\s+/).filter(Boolean)
    .map(w => w[0].toUpperCase() + w.slice(1))
    .join('')
}

// Generate candidate wiki page slugs to try
function wikiSlugs(name) {
  const pascal = toPascalCase(name)
  const underscored = name.replace(/\s+/g, '_')
  return [underscored, pascal].filter((v, i, a) => a.indexOf(v) === i)
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    const opts = { headers: HEADERS }
    https.get(url, opts, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        return fetchText(res.headers.location).then(resolve, reject)
      }
      if (res.statusCode !== 200) return reject(res.statusCode)
      let body = ''
      res.setEncoding('utf8')
      res.on('data', chunk => body += chunk)
      res.on('end', () => resolve(body))
    }).on('error', reject)
  })
}

// Extract portrait image URL from wiki page HTML
function extractPortraitUrl(html) {
  // Look for Portrait image in infobox or gallery — pattern: /images/...Portrait.png...
  const patterns = [
    /src="(\/images\/[^"]*Portrait\.png[^"]*)"/i,
    /src="(\/images\/[^"]*portrait[^"]*\.png[^"]*)"/i,
    /href="(\/images\/[^"]*Portrait\.png[^"]*)"/i,
  ]
  for (const pat of patterns) {
    const m = html.match(pat)
    if (m) return WIKI_BASE + m[1]
  }
  return null
}

function downloadUrl(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest)
    const opts = { headers: HEADERS }
    https.get(url, opts, res => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        return downloadUrl(res.headers.location, dest).then(resolve, reject)
      }
      if (res.statusCode !== 200) {
        file.close()
        if (fs.existsSync(dest)) fs.unlinkSync(dest)
        return reject(res.statusCode)
      }
      res.pipe(file)
      file.on('finish', () => file.close(() => resolve(true)))
    }).on('error', err => {
      file.close()
      if (fs.existsSync(dest)) fs.unlinkSync(dest)
      reject(err)
    })
  })
}

async function tryFetchPortrait(entry) {
  const dest = path.join(IMG_DIR, `${entry.id}.png`)
  if (fs.existsSync(dest)) return { status: 'exists', file: `${entry.id}.png` }

  for (const slug of wikiSlugs(entry.name)) {
    const pageUrl = `${WIKI_BASE}/wiki/${encodeURIComponent(slug)}`
    try {
      const html = await fetchText(pageUrl)
      const imgUrl = extractPortraitUrl(html)
      if (!imgUrl) continue
      await downloadUrl(imgUrl, dest)
      return { status: 'ok', file: `${entry.id}.png`, url: imgUrl }
    } catch (e) {
      // try next slug
    }
  }
  return { status: 'not-found' }
}

async function main() {
  const data = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'))
  const todo = data.filter(e => !e.image)
  console.log(`Fetching images for ${todo.length} entries via wiki pages...\n`)

  let found = 0, missing = 0
  for (const entry of todo) {
    process.stdout.write(`  ${entry.name.padEnd(50)}`)
    const result = await tryFetchPortrait(entry)
    if (result.status === 'ok' || result.status === 'exists') {
      entry.image = result.file
      found++
      console.log(`✓  ${result.file}`)
    } else {
      missing++
      console.log('✗  not found')
    }
  }

  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2))
  console.log(`\n✓ ${found} downloaded · ✗ ${missing} not found`)
  if (missing > 0) {
    console.log('\nStill missing (name → expected filename):')
    data.filter(e => !e.image).forEach(e => console.log(`  ${e.name.padEnd(45)} →  ${e.id}.png`))
  }
}

main().catch(console.error)
