export function toKey(date) {
  return date.toISOString().slice(0, 10)
}

export function today() {
  return new Date()
}

export function addDays(date, n) {
  const d = new Date(date)
  d.setDate(d.getDate() + n)
  return d
}

export function startOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  // Monday-start week
  const diff = (day === 0 ? -6 : 1 - day)
  d.setDate(d.getDate() + diff)
  return d
}

export function weekDays(date) {
  const mon = startOfWeek(date)
  return Array.from({ length: 7 }, (_, i) => addDays(mon, i))
}

const KO_DAY = ['일', '월', '화', '수', '목', '금', '토']
export function formatDay(date) {
  return KO_DAY[date.getDay()]
}

export function formatDate(date) {
  return `${date.getMonth() + 1}/${date.getDate()}`
}

export function isSameDay(a, b) {
  return toKey(a) === toKey(b)
}

export function formatFullDate(date) {
  return `${date.getFullYear()}년 ${date.getMonth() + 1}월 ${date.getDate()}일 (${formatDay(date)})`
}
