<template>
  <div>
    <h2 class="page-title">基础数据</h2>
    <div class="grid-cards">
      <div class="page-card card" v-for="c in cards" :key="c.to" @click="$router.push(c.to)">
        <h3>{{ c.title }}</h3>
        <p class="muted">{{ c.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const all = [
  { key: 'org', title: '组织', desc: '院系与组织架构', to: '/base/org' },
  { key: 'users', title: '用户', desc: '账号启停与角色归属', to: '/base/users' },
  { key: 'roles', title: '角色权限', desc: '菜单与功能授权', to: '/base/roles' },
  { key: 'logs', title: '日志', desc: '操作 / 访问 / 开放接口', to: '/base/logs' },
  { key: 'calendar', title: '校历节次', desc: '学期周次与节次配置', to: '/base/calendar' },
  { key: 'messages', title: '消息', desc: '站内通知与跳转', to: '/base/messages' },
  { key: 'labs', title: '实训室用房', desc: '用房、容量与管理员', to: '/base/labs' },
  { key: 'apps', title: '授权应用', desc: '开放接口 AppKey 管理', to: '/base/apps' },
]

const cards = computed(() => all.filter((i) => auth.baseMenus.includes(i.key)))
</script>

<style scoped>
.card {
  cursor: pointer;
}
.card h3 {
  margin: 0 0 6px;
  color: #1f4b99;
}
</style>
