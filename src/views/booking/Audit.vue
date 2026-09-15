<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">审核中心</h2>
      <el-tag>{{ roleHint }}</el-tag>
    </div>
    <el-alert
      title="可通过顶栏账号切换：教师提交 → 实训室管理员一级审核 → 中心管理员终审。"
      type="info"
      :closable="false"
      style="margin-bottom: 12px"
    />
    <el-table :data="list" border>
      <el-table-column prop="id" label="单号" width="160" />
      <el-table-column prop="labName" label="实训室" min-width="120" />
      <el-table-column prop="applicantName" label="申请人" width="90" />
      <el-table-column prop="date" label="日期" width="110" />
      <el-table-column label="节次" width="100">
        <template #default="{ row }">{{ row.periods.join(',') }}</template>
      </el-table-column>
      <el-table-column prop="purpose" label="用途" min-width="140" />
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-tag size="small" :type="statusType(row.status)">{{ statusText(row.status) }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="220" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/booking/progress/${row.id}`)">进度</el-button>
          <el-button
            v-if="canAudit(row)"
            link
            type="success"
            @click="doAudit(row.id, true)"
          >通过</el-button>
          <el-button
            v-if="canAudit(row)"
            link
            type="danger"
            @click="doAudit(row.id, false)"
          >驳回</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useAuthStore } from '@/stores/auth'
import { useBookingStore } from '@/stores/booking'
import type { BookingRecord } from '@/mock/bookings'

const auth = useAuthStore()
const booking = useBookingStore()

const roleHint = computed(() => {
  if (auth.role === 'labadmin') return '当前可处理：一级审核'
  if (auth.role === 'centeradmin') return '当前可处理：二级终审'
  if (auth.role === 'sysadmin') return '当前可处理：全部审核'
  return '当前角色无审核权限，请切换账号'
})

const list = computed(() =>
  booking.records.filter((r) => r.status === 'pending_l1' || r.status === 'pending_l2' || r.status === 'approved' || r.status === 'rejected'),
)

function statusText(s: BookingRecord['status']) {
  const map = {
    pending_l1: '待一级审核',
    pending_l2: '待二级审核',
    approved: '已同意',
    rejected: '已驳回',
    cancelled: '已取消',
  }
  return map[s]
}

function statusType(s: BookingRecord['status']) {
  if (s === 'approved') return 'success'
  if (s === 'rejected') return 'danger'
  return 'warning'
}

function canAudit(row: BookingRecord) {
  const role = auth.role
  if (role === 'sysadmin') return row.status === 'pending_l1' || row.status === 'pending_l2'
  if (role === 'labadmin') return row.status === 'pending_l1'
  if (role === 'centeradmin') return row.status === 'pending_l2'
  return false
}

async function doAudit(id: string, pass: boolean) {
  const { value } = await ElMessageBox.prompt(pass ? '通过意见' : '驳回原因', '审核', {
    inputValue: pass ? '同意' : '',
    confirmButtonText: '提交',
  })
  const ok = booking.audit(id, pass, value || (pass ? '同意' : '驳回'))
  if (ok) ElMessage.success(pass ? '已通过' : '已驳回')
  else ElMessage.warning('当前账号无法审核该单')
}
</script>
