export interface TermInfo {
  id: string
  name: string
  start: string
  end: string
  weeks: number
}

export interface Period {
  id: string
  name: string
  start: string
  end: string
}

export const terms: TermInfo[] = [
  { id: 't1', name: '2025-2026 学年第一学期', start: '2025-09-01', end: '2026-01-18', weeks: 20 },
  { id: 't2', name: '2025-2026 学年第二学期', start: '2026-02-23', end: '2026-07-05', weeks: 19 },
]

export const periods: Period[] = [
  { id: 'p1', name: '第1节', start: '08:00', end: '08:45' },
  { id: 'p2', name: '第2节', start: '08:55', end: '09:40' },
  { id: 'p3', name: '第3节', start: '10:00', end: '10:45' },
  { id: 'p4', name: '第4节', start: '10:55', end: '11:40' },
  { id: 'p5', name: '第5节', start: '14:00', end: '14:45' },
  { id: 'p6', name: '第6节', start: '14:55', end: '15:40' },
  { id: 'p7', name: '第7节', start: '16:00', end: '16:45' },
  { id: 'p8', name: '第8节', start: '16:55', end: '17:40' },
  { id: 'p9', name: '第9节', start: '19:00', end: '19:45' },
  { id: 'p10', name: '第10节', start: '19:55', end: '20:40' },
]
