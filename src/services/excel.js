import * as XLSX from 'xlsx'
import { buildVerticalQuery } from './cryptoKeywords'

export async function readExcel(file) {
  const data = await file.arrayBuffer()
  const wb = XLSX.read(data)
  const sheet = wb.Sheets[wb.SheetNames[0]]
  const rows = XLSX.utils.sheet_to_json(sheet, { header: 1, defval: '' })

  const parsed = []

  rows.forEach((row, index) => {
    const first = String(row[0] || '').trim()
    const second = String(row[1] || '').trim()

    if (!first) return
    if (index === 0 && first.toLowerCase().includes('nome')) return

    const filename = normalizeFilename(first)
    const baseQuery = second && !second.startsWith('http')
      ? second
      : filenameToQuery(filename)
    const query = buildVerticalQuery(filename, baseQuery)

    parsed.push({
      id: `${Date.now()}-${index}`,
      filename,
      query,
      results: [],
      selected: null,
      status: 'Pronto',
      error: ''
    })
  })

  return parsed
}

export function normalizeFilename(name) {
  let value = String(name || '').trim().replace(/\\/g, '/')
  if (!/\.(jpg|jpeg|png|webp)$/i.test(value)) value += '.jpg'
  return value
}

export function filenameToQuery(filename) {
  return String(filename || '')
    .replace(/\.(jpg|jpeg|png|webp)$/i, '')
    .split('/')
    .pop()
    .replace(/[-_]/g, ' ')
}
