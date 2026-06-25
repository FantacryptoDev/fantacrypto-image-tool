import JSZip from 'jszip'
import { saveAs } from 'file-saver'

export async function createImagesZip(items, onProgress = () => {}) {
  const zip = new JSZip()
  const selectedItems = items.filter(item => item.selected)

  let ok = 0
  let fail = 0
  const log = []

  for (let i = 0; i < selectedItems.length; i++) {
    const item = selectedItems[i]
    const image = item.selected

    try {
      onProgress({ current: i + 1, total: selectedItems.length, filename: item.filename })

      const blob = await downloadImage(image.imageUrl)
      const filename = ensureExtension(item.filename, blob.type, image.imageUrl)

      zip.file(filename, blob)

      log.push({
        filename,
        query: item.query,
        source: image.source,
        imageUrl: image.imageUrl,
        landingUrl: image.landingUrl,
        license: image.license,
        creator: image.creator,
        title: image.title,
        status: 'ok'
      })
      ok++
    } catch (error) {
      fail++
      log.push({
        filename: item.filename,
        query: item.query,
        source: image.source,
        imageUrl: image.imageUrl,
        landingUrl: image.landingUrl,
        license: image.license,
        creator: image.creator,
        title: image.title,
        status: 'error',
        error: error.message
      })
    }
  }

  zip.file('licenses-and-sources.csv', toCsv(log))

  const content = await zip.generateAsync({ type: 'blob' })
  saveAs(content, 'fantacrypto-images.zip')

  return { ok, fail, log }
}

async function downloadImage(url) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`Download ${res.status}`)
  return await res.blob()
}

function ensureExtension(filename, mime, url) {
  let ext = '.jpg'
  if (mime?.includes('png')) ext = '.png'
  if (mime?.includes('webp')) ext = '.webp'
  if (mime?.includes('jpeg')) ext = '.jpg'

  const cleanUrl = String(url || '').split('?')[0].toLowerCase()
  if (cleanUrl.endsWith('.png')) ext = '.png'
  if (cleanUrl.endsWith('.webp')) ext = '.webp'
  if (cleanUrl.endsWith('.jpg') || cleanUrl.endsWith('.jpeg')) ext = '.jpg'

  return filename.replace(/\.(jpg|jpeg|png|webp)$/i, ext)
}

function toCsv(rows) {
  const headers = ['filename','query','source','imageUrl','landingUrl','license','creator','title','status','error']
  return [
    headers.join(','),
    ...rows.map(row => headers.map(h => `"${String(row[h] || '').replace(/"/g, '""')}"`).join(','))
  ].join('\n')
}

export function exportResultsCsv(items) {
  const rows = items
    .filter(item => item.selected)
    .map(item => ({
      filename: item.filename,
      query: item.query,
      source: item.selected.source,
      imageUrl: item.selected.imageUrl,
      landingUrl: item.selected.landingUrl,
      license: item.selected.license,
      creator: item.selected.creator,
      title: item.selected.title,
      status: 'selected',
      error: ''
    }))

  const blob = new Blob([toCsv(rows)], { type: 'text/csv;charset=utf-8' })
  saveAs(blob, 'fantacrypto-selected-images.csv')
}
