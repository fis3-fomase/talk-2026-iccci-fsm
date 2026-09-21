#!/usr/bin/env node
// Regenerates citations.data.ts from bibliography.bib + the <Cite id="..."/> tags
// used across the deck. Runs automatically before `dev`/`build` (see package.json).
import { readFile, writeFile, readdir } from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)))
const bibPath = path.join(root, 'bibliography.bib')
const outPath = path.join(root, 'citations.data.ts')

// ---------- BibTeX parsing ----------

function parseFields(text) {
  const fields = {}
  let i = 0
  const n = text.length
  while (i < n) {
    while (i < n && /[\s,]/.test(text[i])) i++
    if (i >= n) break
    const nameStart = i
    while (i < n && /[A-Za-z0-9_-]/.test(text[i])) i++
    const name = text.slice(nameStart, i)
    if (!name) { i++; continue }
    while (i < n && /\s/.test(text[i])) i++
    if (text[i] !== '=') continue
    i++
    while (i < n && /\s/.test(text[i])) i++
    let value = ''
    if (text[i] === '{') {
      let depth = 0
      const start = i
      do {
        if (text[i] === '{') depth++
        else if (text[i] === '}') depth--
        i++
      } while (depth > 0 && i < n)
      value = text.slice(start + 1, i - 1)
    } else if (text[i] === '"') {
      i++
      const start = i
      while (i < n && text[i] !== '"') i++
      value = text.slice(start, i)
      i++
    } else {
      const start = i
      while (i < n && text[i] !== ',') i++
      value = text.slice(start, i).trim()
    }
    // skip fields the .bib author marked as disabled (leading "_" or "disabled" prefix)
    if (!/^_/.test(name) && !/^disabled/i.test(name)) {
      fields[name.toLowerCase()] = value
    }
    while (i < n && /\s/.test(text[i])) i++
    if (text[i] === ',') i++
  }
  return fields
}

function parseBibtex(text) {
  const entries = new Map()
  const re = /@(\w+)\s*\{/g
  let m
  while ((m = re.exec(text))) {
    let i = re.lastIndex - 1
    let depth = 0
    const start = i
    do {
      if (text[i] === '{') depth++
      else if (text[i] === '}') depth--
      i++
    } while (depth > 0 && i < text.length)
    const body = text.slice(start + 1, i - 1)
    const commaIdx = body.indexOf(',')
    const key = body.slice(0, commaIdx).trim()
    entries.set(key, { type: m[1].toLowerCase(), fields: parseFields(body.slice(commaIdx + 1)) })
    re.lastIndex = i
  }
  return entries
}

// ---------- LaTeX -> plain text cleanup ----------

const ACCENTS = { "'": '́', '`': '̀', '"': '̈', '^': '̂', '~': '̃', c: '̧', v: '̌', H: '̋', k: '̨', '=': '̄', '.': '̇', b: '̱', d: '̣', r: '̊', u: '̆' }

function cleanLatex(raw) {
  if (!raw) return ''
  let s = raw.replace(/\s*\n\s*/g, ' ')
  // \emph{x}, \textbf{x}, ... -> x
  s = s.replace(/\\[a-zA-Z]+\s*\{([^{}]*)\}/g, '$1')
  // accented letters via combining marks: \'e, \"{o}, \c{c}, ...
  s = s.replace(/\\([`'"^~]|[cvHku=.br])\{?([a-zA-Z])\}?/g, (_, cmd, letter) => {
    const mark = ACCENTS[cmd]
    return mark ? (letter + mark).normalize('NFC') : letter
  })
  s = s.replace(/\\ss\b/g, 'ß')
  s = s.replace(/\\&/g, '&').replace(/\\%/g, '%')
  s = s.replace(/---/g, '—').replace(/--/g, '–')
  s = s.replace(/\\[a-zA-Z]+/g, '') // drop any remaining unhandled command
  s = s.replace(/[{}]/g, '')
  return s.replace(/\s+/g, ' ').trim()
}

function escapeHtml(s) {
  return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

function splitTopLevel(raw, sep) {
  // splits on `sep` but not inside {..} groups
  const parts = []
  let depth = 0
  let start = 0
  for (let i = 0; i < raw.length; i++) {
    if (raw[i] === '{') depth++
    else if (raw[i] === '}') depth--
    else if (depth === 0 && raw.slice(i, i + sep.length).toLowerCase() === sep) {
      parts.push(raw.slice(start, i))
      i += sep.length - 1
      start = i + 1
    }
  }
  parts.push(raw.slice(start))
  return parts
}

function normalizeAuthor(a) {
  const cleaned = cleanLatex(a)
  if (cleaned.includes(',')) {
    const [last, first] = cleaned.split(',').map((s) => s.trim())
    return first ? `${first} ${last}` : last
  }
  return cleaned
}

function formatAuthors(raw) {
  if (!raw) return ''
  const normalizedWhitespace = raw.replace(/\s+/g, ' ')
  const names = splitTopLevel(normalizedWhitespace, ' and ').map(normalizeAuthor).filter(Boolean)
  if (names.length === 0) return ''
  if (names.length === 1) return names[0]
  if (names.length <= 3) return `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`
  return `${names[0]} et al.`
}

function formatEntry(fields) {
  const authors = escapeHtml(formatAuthors(fields.author))
  const title = escapeHtml(cleanLatex(fields.title))
  const venue = escapeHtml(cleanLatex(fields.booktitle || fields.journal || fields.publisher || ''))
  const year = escapeHtml(cleanLatex(fields.year || ''))

  let html = ''
  if (authors) html += `${authors.replace(/\.$/, '')}. `
  html += title ? `&ldquo;${title}.&rdquo;` : ''
  if (venue) html += ` <i>${venue}</i>`
  if (year) html += `${venue ? ',' : ''} ${year}`
  html = `${html.trim()}.`

  const url = fields.doi ? `https://doi.org/${fields.doi}` : fields.url
  return { text: html, url }
}

// ---------- scan slides for <Cite id="..."/> / <CiteInSlide id="..."/> usage ----------

async function collectCitedKeys() {
  const files = ['slides.md']
  try {
    const pageFiles = await readdir(path.join(root, 'pages'))
    for (const f of pageFiles) if (f.endsWith('.md')) files.push(path.join('pages', f))
  } catch { /* no pages dir */ }

  const seen = new Set()
  const order = []
  const citeRe = /<Cite(?:InSlide)?\s+id=["']([^"']+)["'][^>]*\/?>/g
  for (const rel of files) {
    const text = await readFile(path.join(root, rel), 'utf8')
    let m
    while ((m = citeRe.exec(text))) {
      for (const rawKey of m[1].split(',')) {
        const key = rawKey.trim()
        if (key && !seen.has(key)) {
          seen.add(key)
          order.push(key)
        }
      }
    }
  }
  return order
}

async function main() {
  const bibText = await readFile(bibPath, 'utf8')
  const bib = parseBibtex(bibText)
  const order = await collectCitedKeys()

  const unknown = order.filter((key) => !bib.has(key))
  if (unknown.length) {
    throw new Error(`Unknown citation key(s) referenced in slides: ${unknown.join(', ')} (check bibliography.bib)`)
  }

  const citations = {}
  order.forEach((key, idx) => {
    const { fields } = bib.get(key)
    citations[key] = { key, number: idx + 1, ...formatEntry(fields) }
  })

  const banner = '// AUTO-GENERATED by scripts/gen-citations.mjs — do not edit by hand.\n// Regenerate with `npm run citations` (also runs automatically before dev/build).\n'
  const body = `export interface CitationEntry {\n  key: string\n  number: number\n  text: string\n  url?: string\n}\n\nexport const citations: Record<string, CitationEntry> = ${JSON.stringify(citations, null, 2)}\n\nexport const citationOrder: string[] = ${JSON.stringify(order, null, 2)}\n`

  await writeFile(outPath, banner + '\n' + body)
  console.log(`[citations] wrote ${order.length} reference(s) to ${path.relative(root, outPath)}`)
}

main().catch((err) => {
  console.error('[citations]', err.message)
  process.exit(1)
})
