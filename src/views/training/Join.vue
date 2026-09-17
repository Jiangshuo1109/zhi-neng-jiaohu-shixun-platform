<template>
  <div class="join-page">
    <div class="panel">
      <div class="brand">智能交互实训室平台</div>
      <div class="toolbar" style="margin-bottom: 12px">
        <el-tag :type="typeTagType" size="large">{{ typeLabel }}教学</el-tag>
        <span class="muted">邀请码 {{ code }}</span>
      </div>
      <h1>{{ shareTitle }}</h1>
      <p class="sub">扫码 / 链接进入课堂，无需单独登录即可查看本次教学概览。</p>

      <el-descriptions :column="1" border size="small" class="summary">
        <el-descriptions-item label="实训室">{{ room }}</el-descriptions-item>
        <el-descriptions-item label="课程 / 班级">{{ course }}</el-descriptions-item>
        <el-descriptions-item label="指导教师">{{ teacher }}</el-descriptions-item>
        <el-descriptions-item label="有效期">{{ expire }}</el-descriptions-item>
      </el-descriptions>

      <el-button
        v-if="!entered"
        type="primary"
        size="large"
        class="enter-btn"
        @click="enter"
      >
        进入教学
      </el-button>
      <el-alert
        v-else
        type="success"
        :closable="false"
        show-icon
        title="已成功进入教学"
        style="margin-top: 16px"
      />

      <el-card v-if="entered" shadow="never" class="overview">
        <template #header>
          <div class="toolbar" style="margin: 0">
            <strong>已进入教学：{{ shareTitle }}</strong>
            <el-tag type="success" size="small">进行中</el-tag>
          </div>
        </template>
        <p class="muted" style="margin-top: 0">课堂任务概览（学生端示意）</p>
        <el-timeline>
          <el-timeline-item
            v-for="(step, i) in steps"
            :key="step.id"
            :type="i === 0 ? 'primary' : 'info'"
            :hollow="i > 0"
          >
            <div class="step-title">步骤 {{ i + 1 }} · {{ step.title }}</div>
            <div class="muted">{{ step.content }}</div>
          </el-timeline-item>
        </el-timeline>
        <el-divider />
        <div class="muted">工位提示：请确认急停与防护罩状态后开始操作。如需帮助，可在正式登录后使用「一键求助」。</div>
      </el-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { teachingShares, studentTasks } from '@/mock/training'

const route = useRoute()
const entered = ref(false)

const code = computed(() => String(route.params.code || '').toUpperCase())

const typeLabel = computed(() => {
  if (code.value.startsWith('QK')) return '快速'
  if (code.value.startsWith('YY')) return '预约'
  if (code.value.startsWith('CQ')) return '长期'
  return '快速'
})

const typeTagType = computed(() => {
  if (typeLabel.value === '快速') return 'success'
  if (typeLabel.value === '预约') return 'warning'
  return 'info'
})

const matched = computed(() =>
  teachingShares.find((s) => s.link.endsWith(`/join/${code.value}`) || s.link.includes(code.value)),
)

const shareTitle = computed(() => matched.value?.title || `${typeLabel.value}教学 · ${code.value}`)
const expire = computed(() => matched.value?.expire || '今日 22:00')

const room = computed(() => {
  if (code.value.startsWith('YY')) return '机电一体化实训室'
  if (code.value.startsWith('CQ')) return '数控车床实训室 / 常驻'
  return '数控车床实训室'
})

const course = computed(() => {
  if (code.value.startsWith('YY')) return '周四晚答疑 · 数控2301 / 2302'
  if (code.value.startsWith('CQ')) return '数控加工工艺 · 学期常驻教室'
  return '数控车床对刀实训 · 数控2301'
})

const teacher = computed(() => '赵文博')

const steps = computed(() => {
  const task = studentTasks.find((t) => t.name.includes('对刀')) || studentTasks[0]
  return task?.steps?.length
    ? task.steps
    : [
        { id: 'm1', title: '安全确认与开机', content: '检查急停、防护罩与润滑状态。', materials: [], photos: [] },
        { id: 'm2', title: '装夹工件与刀具', content: '正确装夹棒料并确认刀尖高度。', materials: [], photos: [] },
        { id: 'm3', title: '试切对刀', content: '完成 X/Z 向试切并设置坐标系。', materials: [], photos: [] },
        { id: 'm4', title: '验证与收尾', content: '运行验证程序并清理现场。', materials: [], photos: [] },
      ]
})

function enter() {
  entered.value = true
  ElMessage.success(`已进入教学：${shareTitle.value}`)
}
</script>

<style scoped>
.join-page {
  min-height: 100vh;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  background: linear-gradient(160deg, #1f4b99 0%, #0f766e 100%);
  padding: 32px 16px 48px;
}
.panel {
  width: 100%;
  max-width: 560px;
  background: #fff;
  border-radius: 12px;
  padding: 28px 24px;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.18);
}
.brand {
  font-size: 13px;
  color: #6b7280;
  margin-bottom: 8px;
  letter-spacing: 0.02em;
}
h1 {
  margin: 0 0 8px;
  font-size: 22px;
  color: #1f2937;
}
.sub {
  margin: 0 0 16px;
  color: #6b7280;
  font-size: 14px;
}
.summary {
  margin-bottom: 8px;
}
.enter-btn {
  width: 100%;
  margin-top: 20px;
  height: 48px;
  font-size: 16px;
}
.overview {
  margin-top: 20px;
  border: 1px solid #e5e7eb;
}
.step-title {
  font-weight: 600;
  margin-bottom: 4px;
}
</style>
