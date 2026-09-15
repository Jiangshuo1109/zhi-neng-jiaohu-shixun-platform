import { defineStore } from 'pinia'
import { ref } from 'vue'
import { orgs as seedOrgs, type OrgNode } from '@/mock/orgs'
import { users as seedUsers, type UserRow } from '@/mock/users'
import { roles as seedRoles, allPermissions, type RoleDef } from '@/mock/roles'
import { logs as seedLogs } from '@/mock/logs'
import { terms, periods } from '@/mock/calendar'
import { messages as seedMessages, type MessageRow } from '@/mock/messages'
import { labs as seedLabs, type LabRoom } from '@/mock/labs'
import { authApps as seedApps, type AuthApp } from '@/mock/apps'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export const useBaseStore = defineStore('base', () => {
  const orgs = ref<OrgNode[]>(clone(seedOrgs))
  const users = ref<UserRow[]>(clone(seedUsers))
  const roles = ref<RoleDef[]>(clone(seedRoles))
  const logs = ref(clone(seedLogs))
  const messageList = ref<MessageRow[]>(clone(seedMessages))
  const labList = ref<LabRoom[]>(clone(seedLabs))
  const apps = ref<AuthApp[]>(clone(seedApps))

  function addOrg(node: Omit<OrgNode, 'id'>) {
    orgs.value.push({ ...node, id: `o${Date.now()}` })
  }

  function removeOrg(id: string) {
    orgs.value = orgs.value.filter((o) => o.id !== id && o.parentId !== id)
  }

  function toggleUser(id: string) {
    const u = users.value.find((x) => x.id === id)
    if (u) u.status = u.status === 'enabled' ? 'disabled' : 'enabled'
  }

  function addUser(row: Omit<UserRow, 'id' | 'createdAt'>) {
    users.value.unshift({
      ...row,
      id: `usr${Date.now()}`,
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }

  function removeUser(id: string) {
    users.value = users.value.filter((u) => u.id !== id)
  }

  function markRead(id: string) {
    const m = messageList.value.find((x) => x.id === id)
    if (m) m.read = true
  }

  function addLab(row: Omit<LabRoom, 'id'>) {
    labList.value.unshift({ ...row, id: `lab${Date.now()}` })
  }

  function removeLab(id: string) {
    labList.value = labList.value.filter((l) => l.id !== id)
  }

  function addApp(row: Omit<AuthApp, 'id' | 'createdAt' | 'appSecret'>) {
    apps.value.unshift({
      ...row,
      id: `app${Date.now()}`,
      appSecret: 'sk_••••••••' + Math.random().toString(36).slice(2, 6),
      createdAt: new Date().toISOString().slice(0, 10),
    })
  }

  function removeApps(ids: string[]) {
    apps.value = apps.value.filter((a) => !ids.includes(a.id))
  }

  return {
    orgs,
    users,
    roles,
    allPermissions,
    logs,
    terms,
    periods,
    messageList,
    labList,
    apps,
    addOrg,
    removeOrg,
    toggleUser,
    addUser,
    removeUser,
    markRead,
    addLab,
    removeLab,
    addApp,
    removeApps,
  }
})
