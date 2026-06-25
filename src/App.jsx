import { useMemo, useState } from 'react'
import UploadExcel from './components/UploadExcel'
import Controls from './components/Controls'
import ImageGrid from './components/ImageGrid'
import ProgressBar from './components/ProgressBar'
import { searchAllSources } from './services/openverse'
import { createImagesZip, exportResultsCsv } from './services/zip'

export default function App() {
  const [items, setItems] = useState([])
  const [options, setOptions] = useState({
    source: 'all',
    orientation: 'landscape',
    license: '',
    size: '',
    pageSize: 6
  })
  const [busy, setBusy] = useState(false)
  const [progress, setProgress] = useState({ active: false, current: 0, total: 0, label: '' })

  const selectedCount = useMemo(
    () => items.filter(item => item.selected).length,
    [items]
  )

  function updateItem(id, patch) {
    setItems(prev => prev.map(item => item.id === id ? { ...item, ...patch } : item))
  }

  async function searchOne(item) {
    updateItem(item.id, { status: 'Ricerca...', error: '' })

    try {
      const results = await searchAllSources(item.query, options)
      updateItem(item.id, {
        results,
        selected: results[0] || null,
        status: results.length ? 'Completato' : 'Nessun risultato',
        error: results.length ? '' : 'Nessun risultato trovato'
      })
    } catch (error) {
      updateItem(item.id, {
        results: [],
        selected: null,
        status: 'Errore',
        error: error.message
      })
    }
  }

  async function searchAll() {
    setBusy(true)
    setProgress({ active: true, current: 0, total: items.length, label: 'Avvio ricerca...' })

    for (let i = 0; i < items.length; i++) {
      setProgress({ active: true, current: i + 1, total: items.length, label: `Cerco ${items[i].filename}` })
      await searchOne(items[i])
      await wait(500)
    }

    setProgress({ active: false, current: 0, total: 0, label: '' })
    setBusy(false)
  }

  function selectResult(itemId, result) {
    updateItem(itemId, { selected: result })
  }

  async function downloadZip() {
    setBusy(true)
    setProgress({ active: true, current: 0, total: selectedCount, label: 'Creo ZIP...' })

    await createImagesZip(items, p => {
      setProgress({
        active: true,
        current: p.current,
        total: p.total,
        label: `Scarico ${p.filename}`
      })
    })

    setProgress({ active: false, current: 0, total: 0, label: '' })
    setBusy(false)
  }

  return (
    <main>
      <header className="hero">
        <div>
          <p className="eyebrow">Fantacrypto</p>
          <h1>Image Tool</h1>
          <p>
            Cerca immagini con licenze aperte, scegli le anteprime migliori e scarica uno ZIP
            pronto per GitHub/Vercel.
          </p>
        </div>

        <div className="stats">
          <strong>{items.length}</strong>
          <span>righe</span>
          <strong>{selectedCount}</strong>
          <span>selezionate</span>
        </div>
      </header>

      <UploadExcel onLoaded={setItems} />

      <Controls
        options={options}
        setOptions={setOptions}
        onSearchAll={searchAll}
        disabled={!items.length || busy}
      />

      <ProgressBar progress={progress} />

      <div className="actions">
        <button disabled={!selectedCount || busy} onClick={downloadZip}>Genera ZIP</button>
        <button disabled={!selectedCount || busy} onClick={() => exportResultsCsv(items)}>Esporta CSV licenze</button>
      </div>

      <section className="results">
        {items.map(item => (
          <ImageGrid
            key={item.id}
            item={item}
            onSelect={selectResult}
            onRegenerate={() => searchOne(item)}
          />
        ))}
      </section>
    </main>
  )
}

function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}
