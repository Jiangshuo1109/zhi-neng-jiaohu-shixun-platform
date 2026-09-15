<template>
  <div class="shell" :class="{ desktop: isDesktop }">
    <aside v-if="isDesktop" class="sidebar">
      <div class="brand">智能交互实训室</div>
      <nav class="side-nav">
        <router-link
          v-for="item in visibleNav"
          :key="item.key"
          :to="item.path"
          class="side-item"
          :class="{ active: isActive(item.key) }"
        >
          <el-icon :size="18"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </aside>

    <div class="main">
      <header class="topbar">
        <div class="left">
          <div v-if="!isDesktop" class="brand-sm">智能交互实训室</div>
          <el-breadcrumb v-else separator="/">
            <el-breadcrumb-item>{{ currentTitle }}</el-breadcrumb-item>
          </el-breadcrumb>
        </div>
        <AccountSwitcher />
      </header>

      <main class="content">
        <router-view />
      </main>

      <nav v-if="!isDesktop" class="tabbar">
        <router-link
          v-for="item in visibleNav"
          :key="item.key"
          :to="item.path"
          class="tab-item"
          :class="{ active: isActive(item.key) }"
        >
          <el-icon :size="20"><component :is="item.icon" /></el-icon>
          <span>{{ item.label }}</span>
        </router-link>
      </nav>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import {
  Odometer,
  DataBoard,
  Monitor,
  Calendar,
  User,
} from '@element-plus/icons-vue'
import AccountSwitcher from '@/components/AccountSwitcher.vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()
const width = ref(window.innerWidth)
const isDesktop = computed(() => width.value >= 1024)

const allNav = [
  { key: 'workbench', label: '工作台', path: '/workbench', icon: Odometer },
  { key: 'base', label: '基础数据', path: '/base', icon: DataBoard },
  { key: 'training', label: '实体实训', path: '/training', icon: Monitor },
  { key: 'booking', label: '开放预约', path: '/booking', icon: Calendar },
  { key: 'me', label: '我的', path: '/me', icon: User },
]

const visibleNav = computed(() => allNav.filter((n) => auth.menus.includes(n.key)))

const currentTitle = computed(() => (route.meta.title as string) || '工作台')

function isActive(key: string) {
  return route.meta.menu === key || route.path.startsWith(`/${key}`)
}

function onResize() {
  width.value = window.innerWidth
}

onMounted(() => window.addEventListener('resize', onResize))
onUnmounted(() => window.removeEventListener('resize', onResize))
</script>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  background: #F5F7FA;
}
.shell.desktop .main {
  margin-left: 0;
  flex: 1;
  min-width: 0;
}
.sidebar {
  width: 220px;
  background: #1F4B99;
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-shrink: 0;
}
.brand {
  padding: 20px 16px;
  font-weight: 700;
  font-size: 16px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.12);
}
.side-nav {
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.side-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: 8px;
  color: rgba(255, 255, 255, 0.85);
  font-size: 14px;
}
.side-item.active,
.side-item:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #fff;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-width: 0;
  min-height: 100vh;
}
.topbar {
  height: 56px;
  background: #fff;
  border-bottom: 1px solid #E5E7EB;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  position: sticky;
  top: 0;
  z-index: 20;
}
.brand-sm {
  font-weight: 600;
  color: #1F4B99;
  font-size: 15px;
}
.content {
  flex: 1;
  padding: 16px;
  padding-bottom: 80px;
}
.shell.desktop .content {
  padding: 20px 24px;
  padding-bottom: 24px;
}
.tabbar {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  height: 60px;
  background: #fff;
  border-top: 1px solid #E5E7EB;
  display: flex;
  z-index: 30;
}
.tab-item {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  color: #6B7280;
  font-size: 11px;
}
.tab-item.active {
  color: #1F4B99;
}
</style>
