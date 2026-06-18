import { COLORS } from '../constants'

export default function CheckRow({ icon, label, checked, onChange }) {
  return (
    <label style={{
      display: 'flex',
      alignItems: 'center',
      gap: 10,
      padding: '8px 10px',
      borderRadius: 8,
      cursor: 'pointer',
      background: checked ? 'rgba(224,255,79,0.07)' : 'transparent',
      transition: 'background 0.15s',
      userSelect: 'none',
    }}>
      <span style={{
        width: 22,
        height: 22,
        borderRadius: 6,
        border: `2px solid ${checked ? COLORS.accent : COLORS.border}`,
        background: checked ? COLORS.accent : 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        transition: 'all 0.15s',
      }}>
        {checked && <span style={{ color: '#000', fontSize: 13, fontWeight: 900 }}>✓</span>}
      </span>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ display: 'none' }}
      />
      <span style={{ fontSize: 16, flexShrink: 0 }}>{icon}</span>
      <span style={{
        fontSize: 14,
        color: checked ? COLORS.text : COLORS.textMuted,
        textDecoration: checked ? 'none' : 'none',
        transition: 'color 0.15s',
      }}>{label}</span>
    </label>
  )
}
