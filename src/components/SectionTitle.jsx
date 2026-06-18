import { COLORS } from '../constants'

export default function SectionTitle({ icon, title, color }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: 8,
      marginBottom: 10,
      paddingBottom: 6,
      borderBottom: `1px solid ${COLORS.border}`,
    }}>
      <span style={{ fontSize: 18 }}>{icon}</span>
      <span style={{
        fontSize: 13,
        fontWeight: 700,
        letterSpacing: '0.08em',
        color: color || COLORS.accent,
        textTransform: 'uppercase',
      }}>{title}</span>
    </div>
  )
}
