<template>
  <div>
    <h2 class="page-title">开放预约</h2>
    <div class="grid-cards">
      <div class="page-card card" v-for="c in cards" :key="c.to" @click="$router.push(c.to)">
        <h3>{{ c.title }}</h3>
        <p class="muted">{{ c.desc }}</p>
      </div>
    </div>
    <div class="page-card" style="margin-top: 16px">
      <h3 style="margin-top: 0">可预约实训室</h3>
      <el-row :gutter="12">
        <el-col :xs="24" :sm="12" :md="8" v-for="lab in openLabs" :key="lab.id">
          <el-card shadow="hover" style="margin-bottom: 12px" @click="$router.push('/booking/schedule?lab=' + lab.id)">
            <h4 style="margin: 0 0 6px">{{ lab.name }}</h4>
            <p class="muted">{{ lab.building }} {{ lab.floor }} · 容量 {{ lab.capacity }}</p>
            <el-tag type="success" size="small">开放中</el-tag>
          </el-card>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useBaseStore } from '@/stores/base'

const auth = useAuthStore()
const base = useBaseStore()
const openLabs = computed(() => base.labList.filter((l) => l.openStatus === '开放'))

const cards = computed(() => {
  const role = auth.role
  const list: { title: string; desc: string; to: string }[] = []
  if (role === 'labadmin' || role === 'centeradmin' || role === 'sysadmin') {
    list.push({ title: '开放管理', desc: '实训室开放状态一览', to: '/booking/manage' })
  }
  if (role === 'labadmin' || role === 'sysadmin') {
    list.push({ title: '开放设置', desc: '多规则：日期 / 星期 / 节次', to: '/booking/settings' })
  }
  list.push(
    { title: '预约时间表', desc: '周次 × 节次状态一览', to: '/booking/schedule' },
  )
  if (role === 'teacher' || role === 'student' || role === 'sysadmin') {
    list.push({ title: '预约申请', desc: '选择用途与多节次提交', to: '/booking/apply' })
  }
  if (role === 'labadmin' || role === 'centeradmin' || role === 'sysadmin') {
    list.push({ title: '审核中心', desc: '多级审核处理', to: '/booking/audit' })
  }
  list.push(
    { title: '审核进度', desc: '查看审批节点进度', to: '/booking/progress' },
    { title: '预约记录', desc: '查询历史与进度', to: '/booking/records' },
  )
  return list
})
</script>

<style scoped>
.card {
  cursor: pointer;
}
.card h3 {
  margin: 0 0 6px;
  color: #1f4b99;
}
</style>
