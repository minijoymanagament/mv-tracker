import { COLORS } from '../constants'
import { weekDays, formatDay, formatDate, isSameDay, addDays, startOfWeek } from '../dateUtils'

export default function WeekStrip({ selected, onSelect, data }) {
  const days = weekDays(selected)

  function score(key) {
    const d = data[key]
    if (!d) return 0
    const checks = [
      ...Object.values(d.workout || {}),
      ...Object.values(d.body || {}),
      ...Object.values(d.work || {}),
    ]
    const done = checks.filter(Boolean).length
    const total = checks.length
    return total ? done / total : 0
  }

  return (
    <div style={{
      display: 'flex',
      gap: 6,
      padding: '12px 0',
      justifyContent: 'space-between',
    }}>
      {days.map(d => {
        const isToday = isSameDay(d, new Date())
        const isSel = isSameDay(d, selected)
        const key = d.toISOString().slice(0, 10)
        const s = score(key)
        const hasData = data[key] != null

        return (
          <button
            key={key}
            onClick={() => onSelect(d)}
            style={{
              flex: 1,
              background: isSel ? COLORS.accent : COLORS.surfaceHigh,
              border: isToday && !isSel ? `1.5px solid ${COLORS.accent}` : '1.5px solid transparent',
              borderRadius: 10,
              padding: '8px 4px',
              cursor: 'pointer',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 4,
              transition: 'all 0.15s',
            }}
          >
            <span style={{
              fontSize: 11,
              fontWeight: 600,
              color: isSel ? '#000' : COLORS.textMuted,
            }}>{formatDay(d)}</span>
            <span style={{
              fontSize: 13,
              fontWeight: 700,
              color: isSel ? '#000' : COLORS.text,
            }}>{formatDate(d)}</span>
            {hasData && (
              <div style={{
                width: 28,
                height: 4,
                borderRadius: 2,
                background: COLORS.border,
                overflow: 'hidden',
              }}>
                <div style={{
                  width: `${s * 100}%`,
                  height: '100%',
                  background: isSel ? '#000' : COLORS.accent,
                  borderRadius: 2,
                }} />
              </div>
            )}
          </button>
        )
      })}
    </div>
  )
}
