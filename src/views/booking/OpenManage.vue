<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">开放管理</h2>
      <el-input v-model="kw" placeholder="查询实训室" clearable style="width: 180px" />
    </div>
    <el-table :data="filtered" border>
      <el-table-column prop="labName" label="实训室" min-width="140" />
      <el-table-column label="日期范围" min-width="180">
        <template #default="{ row }">{{ row.dateStart }} ~ {{ row.dateEnd }}</template>
      </el-table-column>
      <el-table-column label="星期" width="140">
        <template #default="{ row }">{{ row.weekdays.map((d: number) => '日一二三四五六'[d]).join('、') }}</template>
      </el-table-column>
      <el-table-column prop="periods" label="节次" width="120">
        <template #default="{ row }">{{ row.periods.length }} 节</template>
      </el-table-column>
      <el-table-column label="审核级数" width="100">
        <template #default="{ row }">{{ row.auditLevels === 0 ? '免审' : row.auditLevels + ' 级' }}</template>
      </el-table-column>
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.enabled ? 'success' : 'info'" size="small">{{ row.enabled ? '启用' : '停用' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="160">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push('/booking/settings')">查看</el-button>
          <el-button link type="danger" @click="booking.removeRule(row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBookingStore } from '@/stores/booking'

const booking = useBookingStore()
const kw = ref('')
const filtered = computed(() => {
  const k = kw.value.trim()
  if (!k) return booking.rules
  return booking.rules.filter((r) => r.labName.includes(k))
})
</script>
