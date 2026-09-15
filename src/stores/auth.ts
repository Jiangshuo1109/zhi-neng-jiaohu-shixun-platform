import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { accounts, roleMenus, baseSubMenus, type Account, type RoleKey } from '@/mock/accounts'

const STORAGE_KEY = 'lab_platform_account_id'

export const useAuthStore = defineStore('auth', () => {
  const current = ref<Account | null>(null)

  function load() {
    const id = localStorage.getItem(STORAGE_KEY)
    if (id) {
      current.value = accounts.find((a) => a.id === id) ?? null
    }
  }

  function login(username: string, password: string): boolean {
    const found = accounts.find((a) => a.username === username && a.password === password)
    if (!found) return false
    current.value = found
    localStorage.setItem(STORAGE_KEY, found.id)
    return true
  }

  function loginAs(accountId: string) {
    const found = accounts.find((a) => a.id === accountId)
    if (!found) return
    current.value = found
    localStorage.setItem(STORAGE_KEY, found.id)
  }

  function logout() {
    current.value = null
    localStorage.removeItem(STORAGE_KEY)
  }

  const isLoggedIn = computed(() => !!current.value)
  const role = computed<RoleKey | null>(() => current.value?.role ?? null)
  const menus = computed(() => (role.value ? roleMenus[role.value] : []))
  const baseMenus = computed(() => (role.value ? baseSubMenus[role.value] : []))

  load()

  return {
    current,
    accounts,
    isLoggedIn,
    role,
    menus,
    baseMenus,
    login,
    loginAs,
    logout,
    load,
  }
})
