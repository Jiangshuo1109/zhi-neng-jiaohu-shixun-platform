<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">预约时间表</h2>
      <el-select v-model="labId" style="width: 220px">
        <el-option v-for="l in base.labList" :key="l.id" :label="l.name" :value="l.id" />
      </el-select>
    </div>
    <div class="legend">
      <StatusTag v-for="s in statuses" :key="s" :status="s" />
    </div>
    <div class="grid-wrap">
      <table class="sched">
        <thead>
          <tr>
            <th>节次</th>
            <th v-for="d in data.weekdays" :key="d">{{ d }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(pn, pi) in data.periodNames" :key="pn">
            <td class="p">{{ pn }}</td>
            <td v-for="(d, di) in data.weekdays" :key="d + pn">
              <button
                class="cell"
                :class="statusClass[cell(di, pi).status]"
                @click="onCell(cell(di, pi))"
              >
                {{ statusLabel[cell(di, pi).status] }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import StatusTag from '@/components/StatusTag.vue'
import { useBaseStore } from '@/stores/base'
import {
  buildScheduleGrid,
  statusLabel,
  statusClass,
  type SlotStatus,
} from '@/mock/bookings'

const base = useBaseStore()
const route = useRoute()
const router = useRouter()
const labId = ref((route.query.lab as string) || 'lab1')
const statuses: SlotStatus[] = ['closed', 'expired', 'available', 'pending', 'approved', 'occupied']

const data = computed(() => buildScheduleGrid(labId.value))

function cell(di: number, pi: number) {
  return data.value.grid[di * 10 + pi]
}

function onCell(c: { status: SlotStatus; periodId: string; weekday: string }) {
  if (c.status === 'available') {
    router.push({ path: '/booking/apply', query: { lab: labId.value, period: c.periodId } })
  } else {
    ElMessage.info(`${c.weekday} 第${c.periodId.replace('p', '')}节：${statusLabel[c.status]}`)
  }
}

watch(labId, (v) => {
  router.replace({ query: { ...route.query, lab: v } })
})
</script>

<style scoped>
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 12px;
}
.grid-wrap {
  overflow-x: auto;
}
.sched {
  width: 100%;
  border-collapse: collapse;
  min-width: 720px;
}
.sched th,
.sched td {
  border: 1px solid #E5E7EB;
  padding: 4px;
  text-align: center;
  font-size: 12px;
}
.sched th {
  background: #F9FAFB;
}
.p {
  font-weight: 600;
  width: 48px;
  background: #F9FAFB;
}
.cell {
  width: 100%;
  border: none;
  border-radius: 6px;
  padding: 8px 4px;
  cursor: pointer;
  font-size: 12px;
}
</style>
