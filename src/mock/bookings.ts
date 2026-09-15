export type SlotStatus =
  | 'closed'
  | 'expired'
  | 'available'
  | 'pending'
  | 'approved'
  | 'occupied'

export interface OpenRule {
  id: string
  labId: string
  labName: string
  dateStart: string
  dateEnd: string
  weekdays: number[]
  periods: string[]
  auditLevels: number
  enabled: boolean
}

export interface BookingRecord {
  id: string
  labId: string
  labName: string
  applicantId: string
  applicantName: string
  applicantRole: string
  purpose: string
  date: string
  periods: string[]
  status: 'pending_l1' | 'pending_l2' | 'approved' | 'rejected' | 'cancelled'
  createdAt: string
  nodes: AuditNode[]
}

export interface AuditNode {
  level: number
  title: string
  role: string
  status: 'waiting' | 'passed' | 'rejected' | 'skipped'
  operator?: string
  time?: string
  comment?: string
}

export const openRules: OpenRule[] = [
  {
    id: 'rule1',
    labId: 'lab1',
    labName: '数控车床实训室',
    dateStart: '2026-09-01',
    dateEnd: '2026-12-31',
    weekdays: [1, 2, 3, 4, 5],
    periods: ['p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
    auditLevels: 2,
    enabled: true,
  },
  {
    id: 'rule2',
    labId: 'lab2',
    labName: '数控铣床实训室',
    dateStart: '2026-09-01',
    dateEnd: '2026-12-31',
    weekdays: [1, 3, 5],
    periods: ['p5', 'p6', 'p7', 'p8'],
    auditLevels: 1,
    enabled: true,
  },
  {
    id: 'rule3',
    labId: 'lab3',
    labName: '机电一体化实训室',
    dateStart: '2026-09-01',
    dateEnd: '2026-11-30',
    weekdays: [2, 4, 6],
    periods: ['p1', 'p2', 'p3', 'p4', 'p5', 'p6'],
    auditLevels: 2,
    enabled: true,
  },
  {
    id: 'rule4',
    labId: 'lab5',
    labName: '软件开发实训室',
    dateStart: '2026-09-01',
    dateEnd: '2026-12-31',
    weekdays: [1, 2, 3, 4, 5, 6],
    periods: ['p5', 'p6', 'p7', 'p8', 'p9', 'p10'],
    auditLevels: 0,
    enabled: true,
  },
]

export const bookingRecords: BookingRecord[] = [
  {
    id: 'BK-20260914-001',
    labId: 'lab1',
    labName: '数控车床实训室',
    applicantId: 'u4',
    applicantName: '赵文博',
    applicantRole: '教师',
    purpose: '数控2301 班课外对刀强化训练',
    date: '2026-09-18',
    periods: ['p5', 'p6'],
    status: 'pending_l1',
    createdAt: '2026-09-14 09:28',
    nodes: [
      { level: 1, title: '实训室管理员审核', role: '实训室管理员', status: 'waiting' },
      { level: 2, title: '中心管理员终审', role: '中心管理员', status: 'waiting' },
    ],
  },
  {
    id: 'BK-20260913-002',
    labId: 'lab2',
    labName: '数控铣床实训室',
    applicantId: 'u5',
    applicantName: '陈思远',
    applicantRole: '学生',
    purpose: '技能竞赛备赛练习',
    date: '2026-09-17',
    periods: ['p7', 'p8'],
    status: 'pending_l1',
    createdAt: '2026-09-13 15:40',
    nodes: [
      { level: 1, title: '实训室管理员审核', role: '实训室管理员', status: 'waiting' },
    ],
  },
  {
    id: 'BK-20260912-001',
    labId: 'lab3',
    labName: '机电一体化实训室',
    applicantId: 'u4',
    applicantName: '赵文博',
    applicantRole: '教师',
    purpose: 'PLC 编程拓展课',
    date: '2026-09-16',
    periods: ['p5', 'p6', 'p7'],
    status: 'approved',
    createdAt: '2026-09-12 11:05',
    nodes: [
      { level: 1, title: '实训室管理员审核', role: '实训室管理员', status: 'passed', operator: '李建国', time: '2026-09-12 14:20', comment: '同意' },
      { level: 2, title: '中心管理员终审', role: '中心管理员', status: 'passed', operator: '王晓华', time: '2026-09-12 16:50', comment: '通过' },
    ],
  },
  {
    id: 'BK-20260910-004',
    labId: 'lab1',
    labName: '数控车床实训室',
    applicantId: 'u5',
    applicantName: '陈思远',
    applicantRole: '学生',
    purpose: '补做实验',
    date: '2026-09-11',
    periods: ['p9', 'p10'],
    status: 'rejected',
    createdAt: '2026-09-10 18:22',
    nodes: [
      { level: 1, title: '实训室管理员审核', role: '实训室管理员', status: 'rejected', operator: '李建国', time: '2026-09-10 19:01', comment: '当日已有教学占用' },
      { level: 2, title: '中心管理员终审', role: '中心管理员', status: 'skipped' },
    ],
  },
  {
    id: 'BK-20260908-005',
    labId: 'lab5',
    labName: '软件开发实训室',
    applicantId: 'u4',
    applicantName: '赵文博',
    applicantRole: '教师',
    purpose: '跨专业联合研讨',
    date: '2026-09-09',
    periods: ['p5', 'p6'],
    status: 'approved',
    createdAt: '2026-09-08 10:00',
    nodes: [
      { level: 0, title: '无需审核', role: '系统', status: 'passed', operator: '系统', time: '2026-09-08 10:00', comment: '开放规则免审' },
    ],
  },
]

/** Week grid sample for lab1 on week of 2026-09-15 */
export function buildScheduleGrid(labId: string) {
  const weekdays = ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
  const periodIds = ['p1', 'p2', 'p3', 'p4', 'p5', 'p6', 'p7', 'p8', 'p9', 'p10']
  const periodNames = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10']
  const grid: { weekday: string; period: string; periodId: string; status: SlotStatus; tip?: string }[] = []

  const pattern: Record<string, SlotStatus> = {
    // weekday-period
  }

  // Default closed mornings for lab1 style
  for (let d = 0; d < 7; d++) {
    for (let p = 0; p < 10; p++) {
      let status: SlotStatus = 'closed'
      if (labId === 'lab1') {
        if (d < 5 && p >= 4) status = 'available'
        if (d === 0 && (p === 4 || p === 5)) status = 'pending'
        if (d === 1 && (p === 4 || p === 5 || p === 6)) status = 'approved'
        if (d === 2 && p >= 4 && p <= 5) status = 'occupied'
        if (d === 4 && p >= 8) status = 'expired'
      } else if (labId === 'lab2') {
        if ([0, 2, 4].includes(d) && p >= 4 && p <= 7) status = 'available'
        if (d === 2 && (p === 6 || p === 7)) status = 'pending'
      } else if (labId === 'lab5') {
        if (d < 6 && p >= 4) status = 'available'
        if (d === 0 && (p === 4 || p === 5)) status = 'approved'
      } else {
        if ([1, 3, 5].includes(d) && p <= 5) status = 'available'
      }
      grid.push({
        weekday: weekdays[d],
        period: periodNames[p],
        periodId: periodIds[p],
        status,
        tip: status,
      })
    }
  }
  void pattern
  return { weekdays, periodNames, periodIds, grid }
}

export const statusLabel: Record<SlotStatus, string> = {
  closed: '未开放',
  expired: '已过期',
  available: '可预约',
  pending: '待审核',
  approved: '已同意',
  occupied: '已占用',
}

export const statusClass: Record<SlotStatus, string> = {
  closed: 'status-closed',
  expired: 'status-expired',
  available: 'status-available',
  pending: 'status-pending',
  approved: 'status-approved',
  occupied: 'status-occupied',
}
