export default function ProgressBar({ progress }) {
  if (!progress.active) return null

  const value = progress.total ? Math.round((progress.current / progress.total) * 100) : 0

  return (
    <div className="progress-box">
      <progress value={value} max="100" />
      <p>{progress.label || `Avanzamento ${progress.current}/${progress.total}`}</p>
    </div>
  )
}
