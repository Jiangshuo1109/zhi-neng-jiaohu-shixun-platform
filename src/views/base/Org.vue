<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">组织管理</h2>
      <el-button type="primary" @click="openDialog">新增</el-button>
      <el-button @click="batchTip">批量导入</el-button>
    </div>
    <el-table :data="treeRows" row-key="id" border stripe>
      <el-table-column prop="name" label="名称" min-width="160" />
      <el-table-column prop="typeLabel" label="类型" width="100" />
      <el-table-column prop="code" label="编码" width="120" />
      <el-table-column prop="students" label="人数" width="80" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="danger" @click="base.removeOrg(row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" title="新增组织" width="420px">
      <el-form label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="类型">
          <el-select v-model="form.type" style="width: 100%">
            <el-option label="学院" value="college" />
            <el-option label="专业" value="major" />
            <el-option label="班级" value="class" />
          </el-select>
        </el-form-item>
        <el-form-item label="上级">
          <el-select v-model="form.parentId" clearable style="width: 100%">
            <el-option v-for="o in base.orgs" :key="o.id" :label="o.name" :value="o.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="编码"><el-input v-model="form.code" /></el-form-item>
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
const visible = ref(false)
const form = reactive({ name: '', type: 'class' as 'college' | 'major' | 'class', parentId: null as string | null, code: '' })

const typeMap = { college: '学院', major: '专业', class: '班级' }

const treeRows = computed(() =>
  base.orgs.map((o) => ({
    ...o,
    typeLabel: typeMap[o.type],
    students: o.students ?? '-',
  })),
)

function openDialog() {
  form.name = ''
  form.code = ''
  form.type = 'class'
  form.parentId = null
  visible.value = true
}

function save() {
  if (!form.name) return ElMessage.warning('请填写名称')
  base.addOrg({
    name: form.name,
    type: form.type,
    parentId: form.parentId,
    code: form.code || `AUTO-${Date.now()}`,
    students: form.type === 'class' ? 0 : undefined,
  })
  visible.value = false
  ElMessage.success('已新增')
}

function batchTip() {
  ElMessage.success('已导入 3 条组织记录')
}
</script>
