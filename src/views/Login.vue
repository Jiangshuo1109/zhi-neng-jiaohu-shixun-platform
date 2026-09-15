<template>
  <div class="login-page">
    <div class="panel">
      <h1>智能交互实训室平台</h1>
      <p class="sub">请选择账号登录系统</p>
      <el-form label-position="top" @submit.prevent="onSubmit">
        <el-form-item label="账号">
          <el-select v-model="username" placeholder="选择账号" style="width: 100%">
            <el-option
              v-for="a in auth.accounts"
              :key="a.id"
              :label="`${a.username} · ${a.name}（${a.roleLabel}）`"
              :value="a.username"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="密码">
          <el-input v-model="password" type="password" show-password placeholder="默认 123456" />
        </el-form-item>
        <el-button type="primary" native-type="submit" style="width: 100%" :loading="loading">
          登录
        </el-button>
      </el-form>
      <div class="quick">
        <span class="muted">快速进入：</span>
        <el-button
          v-for="a in auth.accounts"
          :key="a.id"
          link
          type="primary"
          @click="quick(a.username)"
        >
          {{ a.roleLabel }} · {{ a.name }}
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const username = ref('teacher')
const password = ref('123456')
const loading = ref(false)

function goIn() {
  const redirect = (route.query.redirect as string) || '/workbench'
  router.replace(redirect)
}

function onSubmit() {
  loading.value = true
  setTimeout(() => {
    const ok = auth.login(username.value, password.value)
    loading.value = false
    if (!ok) {
      ElMessage.error('账号或密码不正确')
      return
    }
    ElMessage.success(`欢迎，${auth.current?.name}`)
    goIn()
  }, 200)
}

function quick(u: string) {
  username.value = u
  password.value = '123456'
  onSubmit()
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(160deg, #1F4B99 0%, #0F766E 100%);
  padding: 24px;
}
.panel {
  width: 100%;
  max-width: 420px;
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}
h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1F2937;
}
.sub {
  margin: 0 0 20px;
  color: #6B7280;
  font-size: 14px;
}
.quick {
  margin-top: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 4px;
}
</style>
