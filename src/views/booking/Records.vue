<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">预约记录</h2>
      <el-select v-model="status" clearable placeholder="状态筛选" style="width: 140px">
        <el-option label="待一级审核" value="pending_l1" />
        <el-option label="待二级审核" value="pending_l2" />
        <el-option label="已同意" value="approved" />
        <el-option label="已驳回" value="rejected" />
      </el-select>
    </div>
    <el-table :data="filtered" border stripe>
      <el-table-column prop="id" label="单号" width="160" />
      <el-table-column prop="labName" label="实训室" min-width="120" />
      <el-table-column prop="applicantName" label="申请人" width="90" />
      <el-table-column prop="date" label="日期" width="110" />
      <el-table-column label="节次" width="110">
        <template #default="{ row }">{{ row.periods.join(',') }}</template>
      </el-table-column>
      <el-table-column prop="createdAt" label="提交时间" width="150" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'danger' : 'warning'">
            {{ text(row.status) }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="100">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/booking/progress/${row.id}`)">进度</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBookingStore } from '@/stores/booking'
import type { BookingRecord } from '@/mock/bookings'

const booking = useBookingStore()
const status = ref<string | undefined>()

const filtered = computed(() => {
  if (!status.value) return booking.records
  return booking.records.filter((r) => r.status === status.value)
})

function text(s: BookingRecord['status']) {
  return (
    {
      pending_l1: '待一级审核',
      pending_l2: '待二级审核',
      approved: '已同意',
      rejected: '已驳回',
      cancelled: '已取消',
    } as const
  )[s]
}
</script>
