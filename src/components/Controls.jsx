export default function Controls({ options, setOptions, onSearchAll, disabled }) {
  return (
    <div className="panel">
      <h2>2. Impostazioni ricerca</h2>

      <div className="controls">
        <label>
          Fonte
          <select value={options.source} onChange={e => setOptions({ ...options, source: e.target.value })}>
            <option value="all">Openverse + Wikimedia</option>
            <option value="openverse">Solo Openverse</option>
            <option value="wikimedia">Solo Wikimedia</option>
            <option value="openai">Genera con AI (OpenAI)</option>
          </select>
        </label>

        <label>
          Orientamento
          <select value={options.orientation} onChange={e => setOptions({ ...options, orientation: e.target.value })}>
            <option value="any">Qualsiasi</option>
            <option value="landscape">Orizzontale</option>
            <option value="portrait">Verticale</option>
            <option value="square">Quadrato</option>
          </select>
        </label>

        <label>
          Licenza Openverse
          <select value={options.license} onChange={e => setOptions({ ...options, license: e.target.value })}>
            <option value="">Tutte aperte</option>
            <option value="cc0">CC0</option>
            <option value="by">CC BY</option>
            <option value="by-sa">CC BY-SA</option>
            <option value="pdm">Public Domain Mark</option>
          </select>
        </label>

        <label>
          Risultati
          <select value={options.pageSize} onChange={e => setOptions({ ...options, pageSize: Number(e.target.value) })}>
            <option value="4">4</option>
            <option value="6">6</option>
            <option value="8">8</option>
          </select>
        </label>
      </div>

      <button disabled={disabled} onClick={onSearchAll}>Cerca immagini per tutte le righe</button>
    </div>
  )
}
