<template>
  <div>
    <h2 class="page-title">我的</h2>
    <div class="page-card profile">
      <el-avatar :size="64" style="background: #1F4B99">{{ auth.current?.name?.slice(0, 1) }}</el-avatar>
      <div>
        <h3 style="margin: 0">{{ auth.current?.name }}</h3>
        <p class="muted">{{ auth.current?.roleLabel }} · {{ auth.current?.org }}</p>
        <p class="muted">{{ auth.current?.phone }} · {{ auth.current?.email }}</p>
      </div>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <h3 style="margin: 0 0 12px; font-size: 16px">账号切换</h3>
      <el-radio-group :model-value="auth.current?.id" @change="onSwitch">
        <el-radio
          v-for="a in auth.accounts"
          :key="a.id"
          :value="a.id"
          style="display: block; margin-bottom: 8px"
        >
          {{ a.name }}（{{ a.roleLabel }}）
        </el-radio>
      </el-radio-group>
    </div>

    <div class="page-card" style="margin-top: 16px">
      <h3 style="margin: 0 0 12px; font-size: 16px">消息设置</h3>
      <el-form label-width="120px">
        <el-form-item label="预约通知"><el-switch v-model="settings.booking" /></el-form-item>
        <el-form-item label="实训通知"><el-switch v-model="settings.training" /></el-form-item>
        <el-form-item label="审核提醒"><el-switch v-model="settings.audit" /></el-form-item>
      </el-form>
    </div>

    <el-button type="danger" plain style="margin-top: 16px" @click="logout">退出登录</el-button>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const settings = reactive({ booking: true, training: true, audit: true })

function onSwitch(id: string | number | boolean | undefined) {
  if (typeof id !== 'string') return
  auth.loginAs(id)
  ElMessage.success(`已切换为 ${auth.current?.name}`)
  router.push('/workbench')
}

function logout() {
  auth.logout()
  router.push('/login')
}
</script>

<style scoped>
.profile {
  display: flex;
  gap: 16px;
  align-items: center;
}
</style>
