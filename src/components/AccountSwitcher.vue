<template>
  <el-dropdown trigger="click" @command="onSwitch">
    <span class="switcher">
      <el-avatar :size="28" class="avatar">{{ auth.current?.name?.slice(0, 1) }}</el-avatar>
      <span class="meta">
        <strong>{{ auth.current?.name }}</strong>
        <small>{{ auth.current?.roleLabel }}</small>
      </span>
      <el-icon><ArrowDown /></el-icon>
    </span>
    <template #dropdown>
      <el-dropdown-menu>
        <el-dropdown-item
          v-for="a in auth.accounts"
          :key="a.id"
          :command="a.id"
          :disabled="a.id === auth.current?.id"
        >
          {{ a.name }} · {{ a.roleLabel }}
        </el-dropdown-item>
        <el-dropdown-item divided command="__logout">退出登录</el-dropdown-item>
      </el-dropdown-menu>
    </template>
  </el-dropdown>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()

function onSwitch(cmd: string) {
  if (cmd === '__logout') {
    auth.logout()
    router.push('/login')
    return
  }
  auth.loginAs(cmd)
  ElMessage.success(`已切换为 ${auth.current?.name}（${auth.current?.roleLabel}）`)
  router.push('/workbench')
}
</script>

<style scoped>
.switcher {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 8px;
}
.switcher:hover {
  background: #F3F4F6;
}
.avatar {
  background: #1F4B99;
  color: #fff;
  font-size: 13px;
}
.meta {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}
.meta strong {
  font-size: 13px;
}
.meta small {
  font-size: 11px;
  color: #6B7280;
}
@media (max-width: 600px) {
  .meta {
    display: none;
  }
}
</style>
