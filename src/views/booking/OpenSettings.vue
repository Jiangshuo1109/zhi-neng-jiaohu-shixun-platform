<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">开放设置</h2>
      <el-button type="primary" @click="openAdd">新增多组规则</el-button>
    </div>
    <el-alert
      title="支持按日期范围、星期、节次配置多组开放规则，并可设置审核级数（0=免审）。"
      type="info"
      :closable="false"
      style="margin-bottom: 12px"
    />
    <el-collapse v-model="active">
      <el-collapse-item v-for="rule in booking.rules" :key="rule.id" :name="rule.id" :title="rule.labName">
        <el-form label-width="100px">
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
          <el-form-item label="启用">
            <el-switch
              :model-value="rule.enabled"
              @update:model-value="(v: boolean) => booking.updateRule(rule.id, { enabled: v })"
            />
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

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
import { ElMessage } from 'element-plus'
import { useBookingStore } from '@/stores/booking'
import { useBaseStore } from '@/stores/base'

const booking = useBookingStore()
const base = useBaseStore()
const active = ref(booking.rules[0]?.id)
const visible = ref(false)
const form = reactive({
  labId: 'lab1',
  range: ['2026-09-01', '2026-12-31'] as string[],
  weekdays: [1, 2, 3, 4, 5],
  periods: ['p5', 'p6', 'p7', 'p8'] as string[],
  auditLevels: 2,
})

function openAdd() {
  visible.value = true
}

function save() {
  const lab = base.labList.find((l) => l.id === form.labId)
  if (!lab || !form.range?.length) return ElMessage.warning('请完善规则')
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
  ElMessage.success('规则已添加')
}
</script>
