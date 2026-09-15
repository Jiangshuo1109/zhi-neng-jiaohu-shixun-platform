<template>
  <div>
    <h2 class="page-title">工作台</h2>
    <el-row :gutter="12">
      <el-col :xs="24" :sm="8" v-for="c in cards" :key="c.title">
        <div class="page-card stat" @click="$router.push(c.to)">
          <div class="num">{{ c.value }}</div>
          <div class="label">{{ c.title }}</div>
        </div>
      </el-col>
    </el-row>

    <div class="page-card" style="margin-top: 16px">
      <h3 style="margin: 0 0 12px; font-size: 16px">待办与消息</h3>
      <el-timeline>
        <el-timeline-item
          v-for="m in unread"
          :key="m.id"
          :timestamp="m.time"
          placement="top"
          :type="m.read ? 'info' : 'primary'"
        >
          <div class="todo" @click="openMsg(m)">
            <strong>{{ m.title }}</strong>
            <p class="muted">{{ m.content }}</p>
          </div>
        </el-timeline-item>
      </el-timeline>
      <el-empty v-if="!unread.length" description="暂无待办消息" />
    </div>

    <div class="page-card" style="margin-top: 16px">
      <h3 style="margin: 0 0 12px; font-size: 16px">快捷入口</h3>
      <div class="shortcuts">
        <el-button v-for="s in shortcuts" :key="s.to" @click="$router.push(s.to)">{{ s.label }}</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useBaseStore } from '@/stores/base'
import { useBookingStore } from '@/stores/booking'
import { useTrainingStore } from '@/stores/training'
import type { MessageRow } from '@/mock/messages'

const auth = useAuthStore()
const base = useBaseStore()
const booking = useBookingStore()
const training = useTrainingStore()
const router = useRouter()

const unread = computed(() => base.messageList.filter((m) => !m.read))

const pendingAudits = computed(
  () => booking.records.filter((r) => r.status === 'pending_l1' || r.status === 'pending_l2').length,
)

const cards = computed(() => {
  const role = auth.role
  if (role === 'student') {
    return [
      { title: '进行中任务', value: training.tasks.filter((t) => t.status === '进行中').length, to: '/training/tasks' },
      { title: '未读消息', value: unread.value.length, to: '/base/messages' },
      { title: '我的预约', value: booking.records.filter((r) => r.applicantId === auth.current?.id).length, to: '/booking/records' },
    ]
  }
  if (role === 'teacher') {
    return [
      { title: '在线学生', value: training.online.filter((o) => o.status !== '离线').length, to: '/training/online' },
      { title: '待批阅报告', value: training.tasks.filter((t) => t.status === '已提交').length, to: '/training/scoring' },
      { title: '预约待审相关', value: pendingAudits.value, to: '/booking/records' },
    ]
  }
  return [
    { title: '待审核预约', value: pendingAudits.value, to: '/booking/audit' },
    { title: '未读消息', value: unread.value.length, to: '/base/messages' },
    { title: '开放实训室', value: base.labList.filter((l) => l.openStatus === '开放').length, to: '/base/labs' },
  ]
})

const shortcuts = computed(() => {
  const role = auth.role
  const list = [{ label: '开放时间表', to: '/booking/schedule' }]
  if (role === 'student') {
    list.unshift({ label: '我的任务', to: '/training/tasks' }, { label: '预约申请', to: '/booking/apply' })
  } else if (role === 'teacher') {
    list.unshift(
      { label: '远程协作', to: '/training/collab' },
      { label: '预约申请', to: '/booking/apply' },
      { label: 'AI 评分', to: '/training/scoring' },
    )
  } else {
    list.unshift(
      { label: '开放设置', to: '/booking/settings' },
      { label: '审核中心', to: '/booking/audit' },
      { label: '用户管理', to: '/base/users' },
    )
  }
  return list
})

function openMsg(m: MessageRow) {
  base.markRead(m.id)
  if (m.link) router.push(m.link)
}
</script>

<style scoped>
.stat {
  cursor: pointer;
  margin-bottom: 12px;
  transition: box-shadow 0.15s;
}
.stat:hover {
  box-shadow: 0 4px 14px rgba(31, 75, 153, 0.12);
}
.num {
  font-size: 28px;
  font-weight: 700;
  color: #1F4B99;
}
.label {
  color: #6B7280;
  margin-top: 4px;
}
.todo {
  cursor: pointer;
}
.todo p {
  margin: 4px 0 0;
}
.shortcuts {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
