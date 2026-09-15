<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">开放管理</h2>
      <el-input v-model="kw" placeholder="查询实训室" clearable style="width: 180px" />
      <el-button type="primary" @click="$router.push('/booking/settings')">多规则设置</el-button>
    </div>
    <el-alert
      :title="`共 ${filtered.length} 条规则，启用 ${filtered.filter(r => r.enabled).length} 条。可前往「开放设置」编辑多组规则。`"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
    />
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
      <el-table-column label="状态" width="110">
        <template #default="{ row }">
          <el-switch
            :model-value="row.enabled"
            inline-prompt
            active-text="启"
            inactive-text="停"
            @change="(v: boolean) => onToggle(row.id, v)"
          />
        </template>
      </el-table-column>
      <el-table-column label="操作" width="200">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push('/booking/settings')">编辑</el-button>
          <el-button link @click="dup(row.id)">复制</el-button>
          <el-button link type="danger" @click="remove(row.id)">移除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBookingStore } from '@/stores/booking'

const booking = useBookingStore()
const kw = ref('')
const filtered = computed(() => {
  const k = kw.value.trim()
  if (!k) return booking.rules
  return booking.rules.filter((r) => r.labName.includes(k))
})

function onToggle(id: string, enabled: boolean) {
  booking.updateRule(id, { enabled })
  ElMessage.success(enabled ? '已启用该规则' : '已停用该规则')
}

function dup(id: string) {
  booking.duplicateRule(id)
  ElMessage.success(`已复制规则，当前共 ${booking.rules.length} 条`)
}

async function remove(id: string) {
  try {
    await ElMessageBox.confirm('确定移除该规则？', '确认', { type: 'warning' })
  } catch {
    return
  }
  booking.removeRule(id)
  ElMessage.success('已移除')
}
</script>
