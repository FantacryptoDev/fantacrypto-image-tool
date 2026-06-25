export default function ImageCard({ result, selected, onSelect }) {
  return (
    <button className={`image-card ${selected ? 'selected' : ''}`} onClick={onSelect} type="button">
      <img src={result.thumbUrl || result.imageUrl} alt={result.title || ''} loading="lazy" />
      <div className="image-meta">
        <strong>{result.source}</strong>
        <span>{result.license || 'Licenza non indicata'}</span>
        {result.width && result.height ? <span>{result.width}×{result.height}</span> : null}
      </div>
    </button>
  )
}
