import ImageCard from './ImageCard'

export default function ImageGrid({ item, onSelect, onRegenerate }) {
  return (
    <div className="item-row">
      <div className="item-head">
        <div>
          <h3>{item.filename}</h3>
          <p>{item.query}</p>
          {item.error ? <p className="error">{item.error}</p> : null}
        </div>
        <div className="status">
          <span className={item.status === 'Completato' ? 'ok' : item.status === 'Errore' ? 'bad' : ''}>
            {item.status}
          </span>
          <button type="button" onClick={() => onRegenerate(item.id)}>Rigenera</button>
        </div>
      </div>

      <div className="grid">
        {item.results.map(result => (
          <ImageCard
            key={result.id}
            result={result}
            selected={item.selected?.id === result.id}
            onSelect={() => onSelect(item.id, result)}
          />
        ))}
      </div>

      {item.selected ? (
        <p className="selected-source">
          Scelta: <a href={item.selected.landingUrl} target="_blank" rel="noreferrer">{item.selected.source}</a>
          {' '}— {item.selected.license || 'licenza non indicata'}
        </p>
      ) : null}
    </div>
  )
}
