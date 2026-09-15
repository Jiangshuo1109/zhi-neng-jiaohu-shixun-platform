<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">用户管理</h2>
      <el-input v-model="kw" placeholder="检索姓名/账号" clearable style="width: 180px" />
      <el-button type="primary" @click="visible = true">注册用户</el-button>
      <el-button @click="ElMessage.success('已导出用户列表')">导出</el-button>
      <el-button @click="ElMessage.success('已批量导入')">导入</el-button>
    </div>
    <el-table :data="filtered" border stripe>
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="username" label="账号" width="110" />
      <el-table-column prop="role" label="角色" width="120" />
      <el-table-column prop="org" label="组织" min-width="120" />
      <el-table-column prop="phone" label="手机" width="120" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.status === 'enabled' ? 'success' : 'info'" size="small">
            {{ row.status === 'enabled' ? '启用' : '禁用' }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="base.toggleUser(row.id)">
            {{ row.status === 'enabled' ? '禁用' : '启用' }}
          </el-button>
          <el-button link type="danger" @click="base.removeUser(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" title="注册用户" width="440px">
      <el-form label-width="80px">
        <el-form-item label="姓名"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="账号"><el-input v-model="form.username" /></el-form-item>
        <el-form-item label="角色"><el-input v-model="form.role" /></el-form-item>
        <el-form-item label="组织"><el-input v-model="form.org" /></el-form-item>
        <el-form-item label="手机"><el-input v-model="form.phone" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useBaseStore } from '@/stores/base'

const base = useBaseStore()
const kw = ref('')
const visible = ref(false)
const form = reactive({ name: '', username: '', role: '学生', org: '', phone: '' })

const filtered = computed(() => {
  const k = kw.value.trim()
  if (!k) return base.users
  return base.users.filter((u) => u.name.includes(k) || u.username.includes(k))
})

function save() {
  if (!form.name || !form.username) return ElMessage.warning('请填写姓名与账号')
  base.addUser({ ...form, status: 'enabled' })
  visible.value = false
  ElMessage.success('用户已注册')
}
</script>
