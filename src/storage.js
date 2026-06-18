const PREFIX = 'mvt_'

export function loadDay(key) {
  try {
    const raw = localStorage.getItem(PREFIX + key)
    return raw ? JSON.parse(raw) : null
  } catch {
    return null
  }
}

export function saveDay(key, data) {
  try {
    localStorage.setItem(PREFIX + key, JSON.stringify(data))
  } catch (e) {
    console.warn('storage error', e)
  }
}

export function defaultDay() {
  return {
    workout: {},     // { [id]: boolean }
    body: {},
    work: {},
    workHours: '',   // string input
    energy: 0,
    mood: '',
    note: '',
    bodyWeight: '',
    sleepHours: '',
  }
}

export function loadAllKeys() {
  const keys = []
  for (let i = 0; i < localStorage.length; i++) {
    const k = localStorage.key(i)
    if (k && k.startsWith(PREFIX)) keys.push(k.slice(PREFIX.length))
  }
  return keys.sort()
}
