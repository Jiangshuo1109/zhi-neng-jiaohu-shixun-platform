<template>
  <div class="page-card">
    <h2 class="page-title">预约申请</h2>
    <el-form label-width="100px" style="max-width: 560px">
      <el-form-item label="实训室">
        <el-select v-model="form.labId" style="width: 100%">
          <el-option v-for="l in openLabs" :key="l.id" :label="l.name" :value="l.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="日期">
        <el-date-picker v-model="form.date" type="date" value-format="YYYY-MM-DD" style="width: 100%" />
      </el-form-item>
      <el-form-item label="节次">
        <el-select v-model="form.periods" multiple style="width: 100%">
          <el-option v-for="p in base.periods" :key="p.id" :label="`${p.name} ${p.start}-${p.end}`" :value="p.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="用途">
        <el-input v-model="form.purpose" type="textarea" :rows="3" placeholder="请说明预约用途" />
      </el-form-item>
      <el-form-item label="审核规则">
        <span class="muted">{{ auditText }}</span>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交申请</el-button>
        <el-button @click="$router.push('/booking/schedule')">查看时间表</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useBaseStore } from '@/stores/base'
import { useBookingStore } from '@/stores/booking'

const base = useBaseStore()
const booking = useBookingStore()
const route = useRoute()
const router = useRouter()

const openLabs = computed(() => base.labList.filter((l) => l.openStatus === '开放'))

const form = reactive({
  labId: (route.query.lab as string) || 'lab1',
  date: '2026-09-18',
  periods: route.query.period ? [route.query.period as string] : (['p5', 'p6'] as string[]),
  purpose: '',
})

const rule = computed(() => booking.rules.find((r) => r.labId === form.labId))
const auditText = computed(() => {
  const n = rule.value?.auditLevels ?? 2
  if (n === 0) return '当前开放规则：无需审核，提交后直接生效'
  if (n === 1) return '当前开放规则：一级审核（实训室管理员）'
  return '当前开放规则：二级审核（实训室管理员 → 中心管理员）'
})

function submit() {
  if (!form.purpose || !form.periods.length) {
    ElMessage.warning('请填写用途并选择节次')
    return
  }
  const lab = base.labList.find((l) => l.id === form.labId)
  if (!lab) return
  const id = booking.applyBooking({
    labId: lab.id,
    labName: lab.name,
    purpose: form.purpose,
    date: form.date,
    periods: form.periods,
    auditLevels: rule.value?.auditLevels ?? 2,
  })
  ElMessage.success(`申请已提交：${id}`)
  router.push(`/booking/progress/${id}`)
}
</script>
