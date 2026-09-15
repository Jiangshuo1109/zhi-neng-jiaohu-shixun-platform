<template>
  <div class="module-layout" :class="{ 'has-aside': showAside }">
    <aside v-if="showAside" class="module-aside page-card">
      <el-button class="back-link" link type="primary" @click="$router.push('/booking/home')">
        ← 返回概览
      </el-button>
      <el-menu :default-active="active" router class="side-menu">
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
        <el-button link type="primary" @click="$router.push('/booking/home')">← 返回概览</el-button>
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
  { label: '开放管理', path: '/booking/manage', roles: ['sysadmin', 'labadmin', 'centeradmin'], group: '开放配置' },
  { label: '开放设置', path: '/booking/settings', roles: ['sysadmin', 'labadmin'], group: '开放配置' },
  { label: '时间表', path: '/booking/schedule', roles: ['all'], group: '预约办理' },
  { label: '预约申请', path: '/booking/apply', roles: ['teacher', 'student', 'sysadmin'], group: '预约办理' },
  { label: '进度', path: '/booking/progress', roles: ['all'], group: '预约办理' },
  { label: '记录', path: '/booking/records', roles: ['all'], group: '预约办理' },
  { label: '审核中心', path: '/booking/audit', roles: ['sysadmin', 'labadmin', 'centeradmin'], group: '审核监管' },
]

const items = computed(() => {
  const role = auth.role
  return all.filter((i) => i.roles.includes('all') || (role && i.roles.includes(role)))
})

const groups = computed(() => {
  const order = ['开放配置', '预约办理', '审核监管']
  return order
    .map((label) => ({
      label,
      items: items.value.filter((i) => i.group === label),
    }))
    .filter((g) => g.items.length > 0)
})

const active = computed(() => {
  if (route.path.startsWith('/booking/progress')) return '/booking/progress'
  const hit = items.value.find((i) => route.path === i.path || route.path.startsWith(i.path + '/'))
  return hit?.path || '/booking/home'
})

const isHome = computed(() => route.path === '/booking' || route.path === '/booking/home')
const showAside = computed(() => !isHome.value)
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
