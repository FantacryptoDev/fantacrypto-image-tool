export const CATEGORY_KEYWORDS = {
  altcoin: ['cryptocurrency', 'blockchain', 'altcoin', 'crypto coin'],
  defi: ['decentralized finance', 'defi', 'crypto', 'blockchain'],
  exchange: ['crypto exchange', 'cryptocurrency trading', 'blockchain'],
  mercato: ['cryptocurrency market', 'crypto', 'blockchain'],
  sicurezza: ['crypto security', 'blockchain security', 'cryptocurrency']
}

export const DEFAULT_KEYWORDS = ['cryptocurrency', 'blockchain']

export function extractCategory(filename) {
  const value = String(filename || '').replace(/\\/g, '/')
  const slashIndex = value.indexOf('/')
  return slashIndex === -1 ? '' : value.slice(0, slashIndex).toLowerCase()
}

export function buildVerticalQuery(filename, query) {
  const base = String(query || '')
  const category = extractCategory(filename)
  const keywords = CATEGORY_KEYWORDS[category] || DEFAULT_KEYWORDS

  const missing = keywords.filter(keyword => !base.toLowerCase().includes(keyword.toLowerCase()))

  return missing.length ? `${base} ${missing.join(' ')}`.trim() : base
}
