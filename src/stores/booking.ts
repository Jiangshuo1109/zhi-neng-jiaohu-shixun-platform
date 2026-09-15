import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  openRules as seedRules,
  bookingRecords as seedRecords,
  type OpenRule,
  type BookingRecord,
  type AuditNode,
} from '@/mock/bookings'
import { useAuthStore } from './auth'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export const useBookingStore = defineStore('booking', () => {
  const rules = ref<OpenRule[]>(clone(seedRules))
  const records = ref<BookingRecord[]>(clone(seedRecords))

  function addRule(rule: Omit<OpenRule, 'id'>) {
    rules.value.unshift({ ...rule, id: `rule${Date.now()}` })
  }

  function updateRule(id: string, patch: Partial<OpenRule>) {
    const i = rules.value.findIndex((r) => r.id === id)
    if (i >= 0) rules.value[i] = { ...rules.value[i], ...patch }
  }

  function removeRule(id: string) {
    rules.value = rules.value.filter((r) => r.id !== id)
  }

  function duplicateRule(id: string) {
    const src = rules.value.find((r) => r.id === id)
    if (!src) return
    const copy = { ...src, id: `rule${Date.now()}`, labName: `${src.labName}（副本）`, enabled: false }
    rules.value.unshift(copy)
  }

  function applyBooking(payload: {
    labId: string
    labName: string
    purpose: string
    date: string
    periods: string[]
    auditLevels: number
  }) {
    const auth = useAuthStore()
    if (!auth.current) return
    const levels = payload.auditLevels
    let nodes: AuditNode[] = []
    let status: BookingRecord['status'] = 'approved'
    if (levels === 0) {
      nodes = [
        {
          level: 0,
          title: '无需审核',
          role: '系统',
          status: 'passed',
          operator: '系统',
          time: new Date().toISOString().slice(0, 16).replace('T', ' '),
          comment: '开放规则免审',
        },
      ]
      status = 'approved'
    } else {
      nodes = [
        { level: 1, title: '实训室管理员审核', role: '实训室管理员', status: 'waiting' },
      ]
      if (levels >= 2) {
        nodes.push({ level: 2, title: '中心管理员终审', role: '中心管理员', status: 'waiting' })
      }
      status = 'pending_l1'
    }
    const id = `BK-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(records.value.length + 1).padStart(3, '0')}`
    records.value.unshift({
      id,
      labId: payload.labId,
      labName: payload.labName,
      applicantId: auth.current.id,
      applicantName: auth.current.name,
      applicantRole: auth.current.roleLabel,
      purpose: payload.purpose,
      date: payload.date,
      periods: payload.periods,
      status,
      createdAt: new Date().toISOString().slice(0, 16).replace('T', ' '),
      nodes,
    })
    return id
  }

  function audit(id: string, pass: boolean, comment: string) {
    const auth = useAuthStore()
    if (!auth.current) return false
    const rec = records.value.find((r) => r.id === id)
    if (!rec) return false
    const role = auth.current.role
    const now = new Date().toISOString().slice(0, 16).replace('T', ' ')

    if (rec.status === 'pending_l1' && (role === 'labadmin' || role === 'sysadmin')) {
      const node = rec.nodes.find((n) => n.level === 1)
      if (!node) return false
      node.status = pass ? 'passed' : 'rejected'
      node.operator = auth.current.name
      node.time = now
      node.comment = comment
      if (!pass) {
        rec.status = 'rejected'
        rec.nodes.forEach((n) => {
          if (n.level > 1 && n.status === 'waiting') n.status = 'skipped'
        })
      } else if (rec.nodes.some((n) => n.level === 2)) {
        rec.status = 'pending_l2'
      } else {
        rec.status = 'approved'
      }
      return true
    }

    if (rec.status === 'pending_l2' && (role === 'centeradmin' || role === 'sysadmin')) {
      const node = rec.nodes.find((n) => n.level === 2)
      if (!node) return false
      node.status = pass ? 'passed' : 'rejected'
      node.operator = auth.current.name
      node.time = now
      node.comment = comment
      rec.status = pass ? 'approved' : 'rejected'
      return true
    }
    return false
  }

  function reset() {
    rules.value = clone(seedRules)
    records.value = clone(seedRecords)
  }

  return { rules, records, addRule, updateRule, removeRule, duplicateRule, applyBooking, audit, reset }
})
