<template>
  <div class="module-layout" :class="{ 'has-aside': showAside }">
    <aside v-if="showAside" class="module-aside page-card">
      <el-button class="back-link" link type="primary" @click="$router.push('/training/home')">
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
        <el-button link type="primary" @click="$router.push('/training/home')">← 返回概览</el-button>
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

const studentItems = [
  { label: '我的任务', path: '/training/tasks', group: '学习' },
]

const teacherItems = [
  { label: '在线学生', path: '/training/online', group: '监管' },
  { label: '实时画面', path: '/training/live', group: '监管' },
  { label: '历史回看', path: '/training/history', group: '监管' },
  { label: '远程协作', path: '/training/collab', group: '协作' },
  { label: '分组教学', path: '/training/groups', group: '协作' },
  { label: '教学分享', path: '/training/share', group: '协作' },
  { label: '报告模板', path: '/training/templates', group: '报告' },
  { label: '任务安排', path: '/training/assign', group: '报告' },
  { label: '批阅评分', path: '/training/scoring', group: '报告' },
  { label: '我的任务', path: '/training/tasks', group: '学习' },
]

const items = computed(() => {
  if (auth.role === 'student') return studentItems
  if (
    auth.role === 'teacher' ||
    auth.role === 'sysadmin' ||
    auth.role === 'labadmin' ||
    auth.role === 'centeradmin'
  ) {
    return teacherItems
  }
  return studentItems
})

const groups = computed(() => {
  const order = ['监管', '协作', '报告', '学习']
  return order
    .map((label) => ({
      label,
      items: items.value.filter((i) => i.group === label),
    }))
    .filter((g) => g.items.length > 0)
})

const active = computed(() => {
  if (route.path.includes('/tasks/')) return '/training/tasks'
  if (route.path.includes('/report/')) return '/training/tasks'
  const hit = items.value.find((i) => route.path === i.path || route.path.startsWith(i.path + '/'))
  return hit?.path || '/training/home'
})

const isHome = computed(() => route.path === '/training' || route.path === '/training/home')
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
