<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">在线学生</h2>
      <el-button :type="training.allMuted ? 'warning' : 'default'" @click="training.allMuted = !training.allMuted">
        {{ training.allMuted ? '取消全员静音' : '全员静音' }}
      </el-button>
    </div>

    <el-alert
      v-for="h in training.pendingHelps"
      :key="h.id"
      type="error"
      :closable="false"
      style="margin-bottom: 10px"
    >
      <template #title>
        <div class="help-inbox">
          <span>{{ h.studentName }} 发起远程求助 · {{ h.taskName }} · {{ h.time }}</span>
          <el-button type="danger" size="small" @click="accept(h.id)">一键接通</el-button>
        </div>
      </template>
    </el-alert>

    <el-table :data="training.online" border>
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="className" label="班级" width="110" />
      <el-table-column prop="device" label="设备/工位" min-width="140" />
      <el-table-column label="状态" width="100">
        <template #default="{ row }">
          <el-tag
            size="small"
            :type="row.status === '求助中' ? 'danger' : row.status === '离线' ? 'info' : 'success'"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastActive" label="活跃" width="100" />
      <el-table-column label="操作" width="240">
        <template #default="{ row }">
          <el-button link type="primary" @click="enter(row.id)">实时画面</el-button>
          <el-button link type="warning" @click="collab(row.id)">远程指导</el-button>
          <el-button
            v-if="row.status === '求助中'"
            link
            type="danger"
            @click="acceptByStudent(row.id)"
          >
            接通求助
          </el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'

const training = useTrainingStore()
const router = useRouter()

function enter(id: string) {
  training.selectStudent(id)
  router.push('/training/live')
}

function collab(id: string) {
  training.selectStudent(id)
  router.push('/training/collab')
}

function accept(helpId: string) {
  training.acceptHelp(helpId)
  ElMessage.success('已接通，进入远程协作')
  router.push('/training/collab')
}

function acceptByStudent(studentId: string) {
  const h = training.pendingHelps.find((x) => x.studentId === studentId)
  if (h) {
    accept(h.id)
  } else {
    training.selectStudent(studentId)
    training.voice = 'connected'
    router.push('/training/collab')
  }
}
</script>

<style scoped>
.help-inbox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
</style>
