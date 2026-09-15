<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">审核进度</h2>
      <el-select v-model="currentId" style="width: 220px" placeholder="选择预约单">
        <el-option v-for="r in booking.records" :key="r.id" :label="r.id" :value="r.id" />
      </el-select>
    </div>
    <template v-if="rec">
      <el-descriptions :column="2" border style="margin-bottom: 20px">
        <el-descriptions-item label="单号">{{ rec.id }}</el-descriptions-item>
        <el-descriptions-item label="实训室">{{ rec.labName }}</el-descriptions-item>
        <el-descriptions-item label="申请人">{{ rec.applicantName }}（{{ rec.applicantRole }}）</el-descriptions-item>
        <el-descriptions-item label="日期节次">{{ rec.date }} / {{ rec.periods.join(', ') }}</el-descriptions-item>
        <el-descriptions-item label="用途" :span="2">{{ rec.purpose }}</el-descriptions-item>
      </el-descriptions>
      <el-steps :active="activeStep" finish-status="success" align-center>
        <el-step
          v-for="n in rec.nodes"
          :key="n.level + n.title"
          :title="n.title"
          :description="desc(n)"
          :status="stepStatus(n.status)"
        />
      </el-steps>
    </template>
    <el-empty v-else description="暂无预约单" />
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { useBookingStore } from '@/stores/booking'
import type { AuditNode } from '@/mock/bookings'

const booking = useBookingStore()
const route = useRoute()
const currentId = ref((route.params.id as string) || booking.records[0]?.id || '')

watch(
  () => route.params.id,
  (v) => {
    if (v) currentId.value = v as string
  },
)

const rec = computed(() => booking.records.find((r) => r.id === currentId.value))

const activeStep = computed(() => {
  if (!rec.value) return 0
  const idx = rec.value.nodes.findIndex((n) => n.status === 'waiting')
  if (idx === -1) return rec.value.nodes.length
  return idx
})

function desc(n: AuditNode) {
  const parts = [n.role]
  if (n.operator) parts.push(n.operator)
  if (n.time) parts.push(n.time)
  if (n.comment) parts.push(n.comment)
  return parts.join(' · ')
}

function stepStatus(s: AuditNode['status']) {
  if (s === 'passed') return 'success'
  if (s === 'rejected') return 'error'
  if (s === 'skipped') return 'wait'
  return 'process'
}
</script>
