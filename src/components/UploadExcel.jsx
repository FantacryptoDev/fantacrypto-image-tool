import { readExcel } from '../services/excel'

export default function UploadExcel({ onLoaded }) {
  async function handleFile(event) {
    const file = event.target.files?.[0]
    if (!file) return

    const rows = await readExcel(file)
    onLoaded(rows)
  }

  return (
    <div className="panel">
      <h2>1. Carica Excel</h2>
      <p>Colonna A: nome file/percorso. Colonna B: query di ricerca.</p>
      <input type="file" accept=".xlsx,.xls,.csv" onChange={handleFile} />
    </div>
  )
}
