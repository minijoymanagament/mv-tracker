import { COLORS } from '../constants'

export default function NoteArea({ value, onChange, placeholder, rows = 3 }) {
  return (
    <textarea
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      rows={rows}
      style={{
        width: '100%',
        background: COLORS.surfaceHigh,
        border: `1px solid ${COLORS.border}`,
        borderRadius: 8,
        color: COLORS.text,
        fontSize: 14,
        padding: '10px 12px',
        resize: 'vertical',
        outline: 'none',
        fontFamily: 'inherit',
        lineHeight: 1.6,
        boxSizing: 'border-box',
      }}
    />
  )
}
