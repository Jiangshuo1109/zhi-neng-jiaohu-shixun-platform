<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">授权应用</h2>
      <el-input v-model="kw" placeholder="关键字查询" clearable style="width: 160px" />
      <el-button type="primary" @click="visible = true">添加</el-button>
      <el-button @click="exportApps">导出</el-button>
      <el-button type="danger" plain :disabled="!selected.length" @click="batchDel">批量删除</el-button>
    </div>
    <el-table :data="filtered" border stripe @selection-change="onSel">
      <el-table-column type="selection" width="48" />
      <el-table-column prop="name" label="应用名称" min-width="140" />
      <el-table-column prop="appKey" label="AppKey" width="140" />
      <el-table-column prop="appSecret" label="AppSecret" width="140" />
      <el-table-column prop="status" label="状态" width="80" />
      <el-table-column prop="createdAt" label="创建日期" width="120" />
      <el-table-column prop="remark" label="备注" min-width="120" />
    </el-table>

    <el-dialog v-model="visible" title="添加授权应用" width="440px">
      <el-form label-width="90px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="AppKey"><el-input v-model="form.appKey" /></el-form-item>
        <el-form-item label="备注"><el-input v-model="form.remark" /></el-form-item>
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
import type { AuthApp } from '@/mock/apps'

const base = useBaseStore()
const kw = ref('')
const visible = ref(false)
const selected = ref<string[]>([])
const form = reactive({ name: '', appKey: '', remark: '', status: '启用' as const })

const filtered = computed(() => {
  const k = kw.value.trim()
  if (!k) return base.apps
  return base.apps.filter((a) => a.name.includes(k) || a.appKey.includes(k))
})

function onSel(rows: AuthApp[]) {
  selected.value = rows.map((r) => r.id)
}

function save() {
  if (!form.name || !form.appKey) return ElMessage.warning('请填写名称与 AppKey')
  base.addApp({ ...form })
  visible.value = false
  ElMessage.success('已添加')
}

function batchDel() {
  base.removeApps(selected.value)
  ElMessage.success('已删除选中应用')
}

function exportApps() {
  ElMessage.success(`已导出 ${filtered.value.length} 条授权应用`)
}
</script>
