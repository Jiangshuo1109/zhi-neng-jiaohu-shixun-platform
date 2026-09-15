<template>
  <div class="page-card">
    <h2 class="page-title">角色权限</h2>
    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <el-table :data="base.roles" highlight-current-row border @current-change="onSelect">
          <el-table-column prop="name" label="角色" />
          <el-table-column prop="code" label="编码" width="110" />
          <el-table-column prop="userCount" label="人数" width="70" />
        </el-table>
      </el-col>
      <el-col :xs="24" :md="14">
        <div v-if="current" class="perm">
          <h3 style="margin-top: 0">{{ current.name }} · 功能权限</h3>
          <el-checkbox-group v-model="checked">
            <el-checkbox
              v-for="p in base.allPermissions"
              :key="p.key"
              :value="p.key"
              style="display: block; margin-bottom: 6px"
            >
              {{ p.label }}
            </el-checkbox>
          </el-checkbox-group>
          <el-button type="primary" style="margin-top: 12px" @click="save">保存权限</el-button>
        </div>
        <el-empty v-else description="请选择角色" />
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useBaseStore } from '@/stores/base'
import type { RoleDef } from '@/mock/roles'

const base = useBaseStore()
const current = ref<RoleDef | null>(null)
const checked = ref<string[]>([])

function onSelect(row: RoleDef | undefined) {
  if (!row) return
  current.value = row
  checked.value = [...row.permissions]
}

function save() {
  if (!current.value) return
  current.value.permissions = [...checked.value]
  ElMessage.success('权限已更新')
}
</script>
