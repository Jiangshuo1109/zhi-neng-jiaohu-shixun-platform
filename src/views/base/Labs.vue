<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">实训室 / 用房</h2>
      <el-button type="primary" @click="visible = true">新增</el-button>
    </div>
    <el-table :data="base.labList" border stripe>
      <el-table-column prop="name" label="名称" min-width="140" />
      <el-table-column prop="building" label="楼宇" width="110" />
      <el-table-column prop="floor" label="房间" width="80" />
      <el-table-column prop="capacity" label="容量" width="70" />
      <el-table-column prop="major" label="所属专业" width="120" />
      <el-table-column prop="manager" label="管理员" width="90" />
      <el-table-column prop="devices" label="设备" min-width="120" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.openStatus === '开放' ? 'success' : row.openStatus === '维护' ? 'warning' : 'info'" size="small">
            {{ row.openStatus }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="90">
        <template #default="{ row }">
          <el-button link type="danger" @click="base.removeLab(row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" title="新增实训室" width="480px">
      <el-form label-width="90px">
        <el-form-item label="名称"><el-input v-model="form.name" /></el-form-item>
        <el-form-item label="楼宇"><el-input v-model="form.building" /></el-form-item>
        <el-form-item label="房间"><el-input v-model="form.floor" /></el-form-item>
        <el-form-item label="容量"><el-input-number v-model="form.capacity" :min="1" /></el-form-item>
        <el-form-item label="专业"><el-input v-model="form.major" /></el-form-item>
        <el-form-item label="管理员"><el-input v-model="form.manager" /></el-form-item>
        <el-form-item label="设备"><el-input v-model="form.devices" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useBaseStore } from '@/stores/base'

const base = useBaseStore()
const visible = ref(false)
const form = reactive({
  name: '',
  building: '',
  floor: '',
  capacity: 30,
  major: '',
  manager: '',
  devices: '',
  openStatus: '开放' as const,
})

function save() {
  if (!form.name) return ElMessage.warning('请填写名称')
  base.addLab({ ...form })
  visible.value = false
  ElMessage.success('已新增')
}
</script>
