<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">开放设置</h2>
      <el-button @click="saveAll">保存全部规则</el-button>
      <el-button type="primary" @click="openAdd">新增规则</el-button>
    </div>
    <el-alert
      title="支持按日期范围、星期、节次配置多组开放规则，并可设置审核级数（0=免审）。每条规则可单独启用/停用、复制。"
      type="info"
      :closable="false"
      show-icon
      style="margin-bottom: 12px"
    />

    <div v-if="booking.rules.length" class="rule-list">
      <el-card
        v-for="rule in booking.rules"
        :key="rule.id"
        class="rule-card"
        :class="{ disabled: !rule.enabled }"
        shadow="hover"
      >
        <div class="rule-hd">
          <div>
            <h3 style="margin: 0 0 4px">{{ rule.labName }}</h3>
            <span class="muted">{{ rule.dateStart }} ~ {{ rule.dateEnd }} · 星期 {{ weekdayText(rule.weekdays) }} · {{ rule.periods.length }} 节</span>
          </div>
          <div class="rule-actions">
            <el-switch
              :model-value="rule.enabled"
              inline-prompt
              active-text="启"
              inactive-text="停"
              @change="(v: boolean) => toggleEnable(rule.id, v)"
            />
            <el-button size="small" @click="dup(rule.id)">复制规则</el-button>
            <el-button size="small" type="danger" plain @click="remove(rule.id)">删除</el-button>
          </div>
        </div>
        <el-form label-width="100px" class="rule-form">
          <el-form-item label="日期范围">
            <el-date-picker
              :model-value="[rule.dateStart, rule.dateEnd]"
              type="daterange"
              value-format="YYYY-MM-DD"
              @update:model-value="(v: string[] | null) => v && booking.updateRule(rule.id, { dateStart: v[0], dateEnd: v[1] })"
            />
          </el-form-item>
          <el-form-item label="开放星期">
            <el-checkbox-group
              :model-value="rule.weekdays"
              @update:model-value="(v: number[]) => booking.updateRule(rule.id, { weekdays: v })"
            >
              <el-checkbox v-for="d in 7" :key="d" :value="d === 7 ? 0 : d" :label="d === 7 ? 0 : d">
                {{ '日一二三四五六'[d === 7 ? 0 : d] }}
              </el-checkbox>
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="开放节次">
            <el-select
              :model-value="rule.periods"
              multiple
              style="width: 100%"
              @update:model-value="(v: string[]) => booking.updateRule(rule.id, { periods: v })"
            >
              <el-option v-for="p in base.periods" :key="p.id" :label="`${p.name} (${p.start}-${p.end})`" :value="p.id" />
            </el-select>
          </el-form-item>
          <el-form-item label="审核级数">
            <el-radio-group
              :model-value="rule.auditLevels"
              @update:model-value="(v: number) => booking.updateRule(rule.id, { auditLevels: v })"
            >
              <el-radio :value="0">免审</el-radio>
              <el-radio :value="1">一级</el-radio>
              <el-radio :value="2">二级</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
    <el-empty v-else description="暂无开放规则，请点击「新增规则」" />

    <el-dialog v-model="visible" title="新增开放规则" width="520px">
      <el-form label-width="100px">
        <el-form-item label="实训室">
          <el-select v-model="form.labId" style="width: 100%">
            <el-option v-for="l in base.labList" :key="l.id" :label="l.name" :value="l.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="日期范围">
          <el-date-picker v-model="form.range" type="daterange" value-format="YYYY-MM-DD" style="width: 100%" />
        </el-form-item>
        <el-form-item label="星期">
          <el-checkbox-group v-model="form.weekdays">
            <el-checkbox v-for="d in [1, 2, 3, 4, 5, 6, 0]" :key="d" :value="d" :label="d">
              {{ '日一二三四五六'[d] }}
            </el-checkbox>
          </el-checkbox-group>
        </el-form-item>
        <el-form-item label="节次">
          <el-select v-model="form.periods" multiple style="width: 100%">
            <el-option v-for="p in base.periods" :key="p.id" :label="p.name" :value="p.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="审核级数">
          <el-radio-group v-model="form.auditLevels">
            <el-radio :value="0">免审</el-radio>
            <el-radio :value="1">一级</el-radio>
            <el-radio :value="2">二级</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useBookingStore } from '@/stores/booking'
import { useBaseStore } from '@/stores/base'

const booking = useBookingStore()
const base = useBaseStore()
const visible = ref(false)
const form = reactive({
  labId: 'lab1',
  range: ['2026-09-01', '2026-12-31'] as string[],
  weekdays: [1, 2, 3, 4, 5],
  periods: ['p5', 'p6', 'p7', 'p8'] as string[],
  auditLevels: 2,
})

function weekdayText(days: number[]) {
  return days.map((d) => '日一二三四五六'[d]).join('')
}

function openAdd() {
  visible.value = true
}

function validateRule(weekdays: number[], periods: string[]) {
  if (!weekdays.length) {
    ElMessage.warning('请至少选择一个开放星期')
    return false
  }
  if (!periods.length) {
    ElMessage.warning('请至少选择一个开放节次')
    return false
  }
  return true
}

function save() {
  const lab = base.labList.find((l) => l.id === form.labId)
  if (!lab || !form.range?.length) return ElMessage.warning('请完善规则')
  if (!validateRule(form.weekdays, form.periods)) return
  booking.addRule({
    labId: lab.id,
    labName: lab.name,
    dateStart: form.range[0],
    dateEnd: form.range[1],
    weekdays: form.weekdays,
    periods: form.periods,
    auditLevels: form.auditLevels,
    enabled: true,
  })
  visible.value = false
  ElMessage.success(`规则已添加，当前共 ${booking.rules.length} 条开放规则`)
}

function saveAll() {
  for (const r of booking.rules) {
    if (!validateRule(r.weekdays, r.periods)) {
      ElMessage.error(`「${r.labName}」规则不完整，请补全星期与节次后再保存`)
      return
    }
  }
  ElMessage.success(`已保存全部开放规则（共 ${booking.rules.length} 条，启用 ${booking.rules.filter((r) => r.enabled).length} 条）`)
}

function toggleEnable(id: string, enabled: boolean) {
  booking.updateRule(id, { enabled })
  ElMessage.success(enabled ? '规则已启用' : '规则已停用')
}

function dup(id: string) {
  booking.duplicateRule(id)
  ElMessage.success(`已复制规则，当前共 ${booking.rules.length} 条`)
}

async function remove(id: string) {
  try {
    await ElMessageBox.confirm('确定删除该开放规则？', '删除确认', { type: 'warning' })
  } catch {
    return
  }
  booking.removeRule(id)
  ElMessage.success(`已删除，剩余 ${booking.rules.length} 条规则`)
}
</script>

<style scoped>
.rule-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
.rule-card {
  border: 1px solid #E5E7EB;
}
.rule-card.disabled {
  opacity: 0.72;
  background: #F9FAFB;
}
.rule-hd {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  flex-wrap: wrap;
  margin-bottom: 8px;
  padding-bottom: 10px;
  border-bottom: 1px dashed #E5E7EB;
}
.rule-actions {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}
.rule-form {
  margin-top: 8px;
}
</style>
