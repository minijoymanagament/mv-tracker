import { useState, useEffect, useCallback } from 'react'
import { COLORS, WORKOUT_ITEMS, BODY_ITEMS, WORK_ITEMS, ENERGY_LEVELS } from './constants'
import { toKey, today, addDays, weekDays, formatFullDate } from './dateUtils'
import { loadDay, saveDay, defaultDay, loadAllKeys } from './storage'
import WeekStrip from './components/WeekStrip'
import SectionTitle from './components/SectionTitle'
import CheckRow from './components/CheckRow'
import NoteArea from './components/NoteArea'
import WeeklyReview from './components/WeeklyReview'

const INPUT_STYLE = {
  background: COLORS.surfaceHigh,
  border: `1px solid ${COLORS.border}`,
  borderRadius: 8,
  color: COLORS.text,
  fontSize: 14,
  padding: '8px 12px',
  outline: 'none',
  fontFamily: 'inherit',
  width: '100%',
  boxSizing: 'border-box',
}

function Section({ children, style }) {
  return (
    <div style={{
      background: COLORS.surface,
      borderRadius: 14,
      padding: 18,
      marginBottom: 14,
      ...style,
    }}>
      {children}
    </div>
  )
}

export default function App() {
  const [selectedDate, setSelectedDate] = useState(today())
  const [view, setView] = useState('day') // 'day' | 'week'
  const [allData, setAllData] = useState({})

  // Load all stored keys on mount
  useEffect(() => {
    const keys = loadAllKeys()
    const loaded = {}
    keys.forEach(k => { loaded[k] = loadDay(k) })
    setAllData(loaded)
  }, [])

  const dateKey = toKey(selectedDate)
  const dayData = allData[dateKey] || defaultDay()

  const updateDay = useCallback((patch) => {
    const updated = { ...dayData, ...patch }
    saveDay(dateKey, updated)
    setAllData(prev => ({ ...prev, [dateKey]: updated }))
  }, [dayData, dateKey])

  function toggleCheck(section, id, val) {
    updateDay({ [section]: { ...dayData[section], [id]: val } })
  }

  const completionCounts = (() => {
    const w = WORKOUT_ITEMS.filter(i => dayData.workout[i.id]).length
    const b = BODY_ITEMS.filter(i => dayData.body[i.id]).length
    const wk = WORK_ITEMS.filter(i => dayData.work[i.id]).length
    const total = w + b + wk
    const max = WORKOUT_ITEMS.length + BODY_ITEMS.length + WORK_ITEMS.length
    return { w, b, wk, total, max }
  })()

  const completionPct = Math.round((completionCounts.total / completionCounts.max) * 100)

  return (
    <div style={{
      minHeight: '100vh',
      background: COLORS.bg,
      color: COLORS.text,
      fontFamily: "'Apple SD Gothic Neo', 'Noto Sans KR', sans-serif",
      maxWidth: 480,
      margin: '0 auto',
      padding: '0 16px',
    }}>
      {/* Header */}
      <div style={{
        padding: '20px 0 8px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <div>
          <div style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em' }}>
            MV Tracker
          </div>
          <div style={{ fontSize: 12, color: COLORS.textMuted, marginTop: 2 }}>
            몸 · 체력 · 작업 · 에너지
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {['day', 'week'].map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: 'none',
                cursor: 'pointer',
                fontSize: 12,
                fontWeight: 700,
                background: view === v ? COLORS.accent : COLORS.surfaceHigh,
                color: view === v ? '#000' : COLORS.textMuted,
                transition: 'all 0.15s',
              }}
            >
              {v === 'day' ? '일간' : '주간'}
            </button>
          ))}
        </div>
      </div>

      {/* Week strip */}
      <WeekStrip selected={selectedDate} onSelect={setSelectedDate} data={allData} />

      {view === 'week' ? (
        <WeeklyReview selectedDate={selectedDate} data={allData} />
      ) : (
        <>
          {/* Date + progress bar */}
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
              <span style={{ fontSize: 14, color: COLORS.textMuted }}>{formatFullDate(selectedDate)}</span>
              <span style={{
                fontSize: 13,
                fontWeight: 700,
                color: completionPct >= 70 ? COLORS.green : COLORS.accent,
              }}>{completionPct}%</span>
            </div>
            <div style={{ height: 5, background: COLORS.border, borderRadius: 3, overflow: 'hidden' }}>
              <div style={{
                width: `${completionPct}%`,
                height: '100%',
                background: completionPct >= 70 ? COLORS.green : COLORS.accent,
                borderRadius: 3,
                transition: 'width 0.3s',
              }} />
            </div>
          </div>

          {/* 몸 만들기 — Body prep */}
          <Section>
            <SectionTitle icon="🏋️" title="몸 만들기  Body Prep" color={COLORS.accentPink} />
            {WORKOUT_ITEMS.map(item => (
              <CheckRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                checked={!!dayData.workout[item.id]}
                onChange={v => toggleCheck('workout', item.id, v)}
              />
            ))}
            <div style={{ marginTop: 12, display: 'flex', gap: 10 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>체중 (kg)</div>
                <input
                  style={INPUT_STYLE}
                  type="number"
                  step="0.1"
                  placeholder="예: 62.5"
                  value={dayData.bodyWeight}
                  onChange={e => updateDay({ bodyWeight: e.target.value })}
                />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>수면 (시간)</div>
                <input
                  style={INPUT_STYLE}
                  type="number"
                  step="0.5"
                  placeholder="예: 7.5"
                  value={dayData.sleepHours}
                  onChange={e => updateDay({ sleepHours: e.target.value })}
                />
              </div>
            </div>
          </Section>

          {/* 체력 관리 — Fitness */}
          <Section>
            <SectionTitle icon="💪" title="체력 관리  Fitness" color={COLORS.accentBlue} />
            {BODY_ITEMS.map(item => (
              <CheckRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                checked={!!dayData.body[item.id]}
                onChange={v => toggleCheck('body', item.id, v)}
              />
            ))}
          </Section>

          {/* 작업 — Work */}
          <Section>
            <SectionTitle icon="🎬" title="작업  Work" color={COLORS.accentOrange} />
            {WORK_ITEMS.map(item => (
              <CheckRow
                key={item.id}
                icon={item.icon}
                label={item.label}
                checked={!!dayData.work[item.id]}
                onChange={v => toggleCheck('work', item.id, v)}
              />
            ))}
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>오늘 총 작업 시간 (h)</div>
              <input
                style={INPUT_STYLE}
                type="number"
                step="0.5"
                placeholder="예: 5.5"
                value={dayData.workHours}
                onChange={e => updateDay({ workHours: e.target.value })}
              />
            </div>
          </Section>

          {/* 에너지 관리 — Energy */}
          <Section>
            <SectionTitle icon="⚡" title="에너지  Energy" color={COLORS.accent} />
            <div style={{ fontSize: 12, color: COLORS.textMuted, marginBottom: 10 }}>오늘의 에너지 레벨</div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              {ENERGY_LEVELS.map(lvl => (
                <button
                  key={lvl.value}
                  onClick={() => updateDay({ energy: lvl.value })}
                  style={{
                    flex: 1,
                    padding: '10px 4px',
                    borderRadius: 10,
                    border: dayData.energy === lvl.value ? `2px solid ${lvl.color}` : `2px solid ${COLORS.border}`,
                    background: dayData.energy === lvl.value ? `${lvl.color}22` : COLORS.surfaceHigh,
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 4,
                    transition: 'all 0.15s',
                  }}
                >
                  <span style={{ fontSize: 18 }}>
                    {['😵', '😔', '😐', '😊', '🔥'][lvl.value - 1]}
                  </span>
                  <span style={{ fontSize: 10, color: dayData.energy === lvl.value ? lvl.color : COLORS.textMuted, fontWeight: 700 }}>
                    {lvl.label}
                  </span>
                </button>
              ))}
            </div>
            <div style={{ fontSize: 11, color: COLORS.textMuted, marginBottom: 4 }}>오늘의 한 줄 (기분 / 특이사항)</div>
            <input
              style={INPUT_STYLE}
              type="text"
              placeholder="예: 오전 촬영 잘 됐고, 오후엔 피로감 있었음"
              value={dayData.mood}
              onChange={e => updateDay({ mood: e.target.value })}
            />
          </Section>

          {/* 메모 — Notes */}
          <Section style={{ marginBottom: 40 }}>
            <SectionTitle icon="📝" title="메모  Notes" color={COLORS.textMuted} />
            <NoteArea
              value={dayData.note}
              onChange={v => updateDay({ note: v })}
              placeholder="오늘 느낀 점, 다음에 개선할 것, 아이디어 등 자유롭게..."
              rows={4}
            />
          </Section>
        </>
      )}
    </div>
  )
}
