<template>
  <div class="module-layout" :class="{ 'has-aside': showAside }">
    <aside v-if="showAside" class="module-aside page-card">
      <el-button class="back-link" link type="primary" @click="$router.push('/base/home')">
        ← 返回概览
      </el-button>
      <el-menu
        :default-active="route.path"
        router
        class="side-menu"
      >
        <el-menu-item-group
          v-for="g in groups"
          :key="g.label"
          :title="g.label"
        >
          <el-menu-item v-for="item in g.items" :key="item.path" :index="item.path">
            {{ item.label }}
          </el-menu-item>
        </el-menu-item-group>
      </el-menu>
    </aside>
    <div class="module-main">
      <div v-if="showAside" class="mobile-back">
        <el-button link type="primary" @click="$router.push('/base/home')">← 返回概览</el-button>
      </div>
      <router-view />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const route = useRoute()

const all = [
  { key: 'org', label: '组织', path: '/base/org', group: '组织人员' },
  { key: 'users', label: '用户', path: '/base/users', group: '组织人员' },
  { key: 'roles', label: '角色权限', path: '/base/roles', group: '组织人员' },
  { key: 'labs', label: '实训室用房', path: '/base/labs', group: '空间资源' },
  { key: 'calendar', label: '校历节次', path: '/base/calendar', group: '空间资源' },
  { key: 'logs', label: '日志', path: '/base/logs', group: '运维对接' },
  { key: 'messages', label: '消息', path: '/base/messages', group: '运维对接' },
  { key: 'apps', label: '授权应用', path: '/base/apps', group: '运维对接' },
]

const items = computed(() => all.filter((i) => auth.baseMenus.includes(i.key)))

const groups = computed(() => {
  const order = ['组织人员', '空间资源', '运维对接']
  return order
    .map((label) => ({
      label,
      items: items.value.filter((i) => i.group === label),
    }))
    .filter((g) => g.items.length > 0)
})

const isHome = computed(() => route.path === '/base' || route.path === '/base/home')
const showAside = computed(() => !isHome.value && items.value.length > 0)
</script>

<style scoped>
.module-layout {
  display: block;
}
.module-layout.has-aside {
  display: grid;
  grid-template-columns: 200px 1fr;
  gap: 12px;
  align-items: start;
}
.module-aside {
  padding: 12px 8px;
  position: sticky;
  top: 12px;
}
.back-link {
  margin: 0 8px 8px;
  padding: 0;
}
.side-menu {
  border-right: none;
  background: transparent;
}
.side-menu :deep(.el-menu-item-group__title) {
  padding: 8px 12px 4px;
  font-size: 12px;
  color: #6b7280;
}
.side-menu :deep(.el-menu-item) {
  height: 36px;
  line-height: 36px;
  margin: 2px 0;
  border-radius: 8px;
}
.mobile-back {
  display: none;
  margin-bottom: 8px;
}
@media (max-width: 900px) {
  .module-layout.has-aside {
    grid-template-columns: 1fr;
  }
  .module-aside {
    display: none;
  }
  .mobile-back {
    display: block;
  }
}
</style>
