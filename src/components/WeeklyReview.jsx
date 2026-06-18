import { COLORS, WORKOUT_ITEMS, BODY_ITEMS, WORK_ITEMS, ENERGY_LEVELS } from '../constants'
import { weekDays, formatDate, formatDay } from '../dateUtils'
import SectionTitle from './SectionTitle'

function StatBar({ label, value, max, color }) {
  const pct = max ? Math.round((value / max) * 100) : 0
  return (
    <div style={{ marginBottom: 10 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
        <span style={{ fontSize: 13, color: COLORS.text }}>{label}</span>
        <span style={{ fontSize: 13, color: color || COLORS.accent, fontWeight: 700 }}>
          {value}/{max}
        </span>
      </div>
      <div style={{ height: 6, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
        <div style={{
          width: `${pct}%`,
          height: '100%',
          background: color || COLORS.accent,
          borderRadius: 3,
          transition: 'width 0.4s',
        }} />
      </div>
    </div>
  )
}

export default function WeeklyReview({ selectedDate, data }) {
  const days = weekDays(selectedDate)
  const keys = days.map(d => d.toISOString().slice(0, 10))
  const dayData = keys.map(k => data[k] || null)

  function countChecks(section) {
    return dayData.map(d => {
      if (!d) return 0
      return Object.values(d[section] || {}).filter(Boolean).length
    })
  }

  const allItems = [...WORKOUT_ITEMS, ...BODY_ITEMS, ...WORK_ITEMS]
  const maxPerDay = allItems.length

  const totalScores = dayData.map(d => {
    if (!d) return 0
    const all = [
      ...Object.values(d.workout || {}),
      ...Object.values(d.body || {}),
      ...Object.values(d.work || {}),
    ]
    return all.filter(Boolean).length
  })

  const avgEnergy = (() => {
    const vals = dayData.filter(d => d && d.energy > 0).map(d => d.energy)
    if (!vals.length) return null
    return (vals.reduce((a, b) => a + b, 0) / vals.length).toFixed(1)
  })()

  const totalWorkHours = dayData.reduce((sum, d) => {
    const h = parseFloat(d?.workHours || 0)
    return sum + (isNaN(h) ? 0 : h)
  }, 0)

  const workDaysLogged = dayData.filter(d => d && parseFloat(d?.workHours) > 0).length

  const bodyDays = countChecks('body')
  const workoutDays = countChecks('workout')

  return (
    <div style={{ padding: '0 0 40px' }}>
      <div style={{
        background: COLORS.surface,
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
      }}>
        <SectionTitle icon="📊" title="주간 요약 Weekly Summary" color={COLORS.accent} />

        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: 12,
          marginBottom: 16,
        }}>
          {[
            { label: '이번주 작업', value: `${totalWorkHours.toFixed(1)}h`, sub: `${workDaysLogged}일 기록` },
            { label: '평균 에너지', value: avgEnergy ? `${avgEnergy}/5` : '-', sub: '에너지 평균' },
          ].map(({ label, value, sub }) => (
            <div key={label} style={{
              background: COLORS.surfaceHigh,
              borderRadius: 10,
              padding: '14px 16px',
              textAlign: 'center',
            }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>{label}</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: COLORS.accent }}>{value}</div>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginTop: 2 }}>{sub}</div>
            </div>
          ))}
        </div>

        <div style={{ marginBottom: 6 }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8, fontWeight: 600 }}>
            일별 달성도 Daily Score
          </div>
          {days.map((d, i) => (
            <StatBar
              key={keys[i]}
              label={`${formatDate(d)} (${formatDay(d)})`}
              value={totalScores[i]}
              max={maxPerDay}
              color={totalScores[i] >= maxPerDay * 0.7 ? COLORS.green : totalScores[i] > 0 ? COLORS.accent : COLORS.textMuted}
            />
          ))}
        </div>
      </div>

      <div style={{
        background: COLORS.surface,
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
      }}>
        <SectionTitle icon="💪" title="운동 / 몸 관리" color={COLORS.accentPink} />
        {WORKOUT_ITEMS.map(item => {
          const count = dayData.filter(d => d?.workout?.[item.id]).length
          return (
            <StatBar key={item.id} label={`${item.icon} ${item.label}`} value={count} max={7} color={COLORS.accentPink} />
          )
        })}
        <div style={{ marginTop: 14 }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8, fontWeight: 600 }}>몸 관리</div>
          {BODY_ITEMS.map(item => {
            const count = dayData.filter(d => d?.body?.[item.id]).length
            return (
              <StatBar key={item.id} label={`${item.icon} ${item.label}`} value={count} max={7} color={COLORS.accentBlue} />
            )
          })}
        </div>
      </div>

      <div style={{
        background: COLORS.surface,
        borderRadius: 14,
        padding: 18,
        marginBottom: 16,
      }}>
        <SectionTitle icon="🎬" title="작업 현황" color={COLORS.accentOrange} />
        {WORK_ITEMS.map(item => {
          const count = dayData.filter(d => d?.work?.[item.id]).length
          return (
            <StatBar key={item.id} label={`${item.icon} ${item.label}`} value={count} max={7} color={COLORS.accentOrange} />
          )
        })}

        <div style={{
          marginTop: 16,
          padding: '12px 14px',
          background: COLORS.surfaceHigh,
          borderRadius: 10,
        }}>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 8 }}>일별 작업 시간</div>
          {days.map((d, i) => {
            const h = parseFloat(dayData[i]?.workHours || 0)
            return (
              <div key={keys[i]} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', fontSize: 13 }}>
                <span style={{ color: COLORS.textMuted }}>{formatDate(d)} ({formatDay(d)})</span>
                <span style={{ color: h > 0 ? COLORS.accentOrange : COLORS.textMuted, fontWeight: h > 0 ? 700 : 400 }}>
                  {h > 0 ? `${h}h` : '-'}
                </span>
              </div>
            )
          })}
        </div>
      </div>

      <div style={{
        background: COLORS.surface,
        borderRadius: 14,
        padding: 18,
      }}>
        <SectionTitle icon="📝" title="메모 모아보기" color={COLORS.textMuted} />
        {days.map((d, i) => {
          const note = dayData[i]?.note
          if (!note) return null
          return (
            <div key={keys[i]} style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, color: COLORS.accent, fontWeight: 600, marginBottom: 4 }}>
                {formatDate(d)} ({formatDay(d)})
              </div>
              <div style={{
                fontSize: 13,
                color: COLORS.textMuted,
                lineHeight: 1.6,
                borderLeft: `2px solid ${COLORS.border}`,
                paddingLeft: 10,
                whiteSpace: 'pre-wrap',
              }}>{note}</div>
            </div>
          )
        })}
        {days.every((_, i) => !dayData[i]?.note) && (
          <div style={{ fontSize: 13, color: COLORS.textMuted }}>이번주 메모 없음</div>
        )}
      </div>
    </div>
  )
}
