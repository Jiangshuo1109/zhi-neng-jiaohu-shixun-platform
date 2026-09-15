<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">
        在线学生
        <el-badge
          v-if="training.pendingHelps.length"
          :value="training.pendingHelps.length"
          class="pending-badge"
        >
          <el-tag type="danger" effect="dark" size="small">待接通求助</el-tag>
        </el-badge>
      </h2>
      <el-button :type="training.allMuted ? 'warning' : 'default'" @click="training.allMuted = !training.allMuted">
        {{ training.allMuted ? '取消全员静音' : '全员静音' }}
      </el-button>
    </div>

    <div v-if="training.pendingHelps.length" class="help-panel">
      <el-alert
        v-for="h in training.pendingHelps"
        :key="h.id"
        type="error"
        show-icon
        :closable="false"
        class="help-alert"
      >
        <template #title>
          <div class="help-inbox">
            <span>
              <strong>{{ h.studentName }}</strong>
              发起远程求助 · {{ h.taskName }} · {{ h.time }}
            </span>
            <el-button type="danger" size="small" @click="accept(h.id)">一键接通</el-button>
          </div>
        </template>
      </el-alert>
    </div>
    <el-alert
      v-else
      title="当前无待接通求助。学生在任务详情发起「远程求助」后会出现在此处。"
      type="info"
      :closable="false"
      style="margin-bottom: 12px"
      show-icon
    />

    <el-table :data="training.online" border :row-class-name="rowClass">
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="className" label="班级" width="110" />
      <el-table-column prop="device" label="设备/工位" min-width="140" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag
            size="small"
            effect="dark"
            :type="row.status === '求助中' ? 'danger' : row.status === '离线' ? 'info' : 'success'"
          >
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="lastActive" label="活跃" width="100" />
      <el-table-column label="操作" width="260">
        <template #default="{ row }">
          <el-button link type="primary" @click="enter(row.id)">实时画面</el-button>
          <el-button link type="warning" @click="collab(row.id)">远程指导</el-button>
          <el-button
            v-if="row.status === '求助中'"
            type="danger"
            size="small"
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

function rowClass({ row }: { row: { status: string } }) {
  return row.status === '求助中' ? 'row-help' : ''
}

function enter(id: string) {
  training.selectStudent(id)
  router.push('/training/live')
}

function collab(id: string) {
  training.selectStudent(id)
  router.push('/training/collab')
}

function accept(helpId: string) {
  const h = training.pendingHelps.find((x) => x.id === helpId)
  training.acceptHelp(helpId)
  ElMessage.success({
    message: `已接通「${h?.studentName || '学生'}」远程求助，状态：已接通，正在进入协作`,
    duration: 2800,
  })
  router.push('/training/collab')
}

function acceptByStudent(studentId: string) {
  const h = training.pendingHelps.find((x) => x.studentId === studentId)
  if (h) {
    accept(h.id)
  } else {
    training.selectStudent(studentId)
    training.voice = 'connected'
    ElMessage.success('已进入远程协作（已接通）')
    router.push('/training/collab')
  }
}
</script>

<style scoped>
.pending-badge {
  margin-left: 10px;
  vertical-align: middle;
}
.help-panel {
  margin-bottom: 12px;
}
.help-alert {
  margin-bottom: 10px;
  border: 2px solid #F56C6C;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.15);
}
.help-inbox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
:deep(.row-help) {
  background: #FEF0F0 !important;
}
</style>
