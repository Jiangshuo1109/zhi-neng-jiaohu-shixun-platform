<template>
  <div class="page-card">
    <h2 class="page-title">任务安排</h2>
    <el-form label-width="100px" style="max-width: 720px">
      <el-form-item label="任务名称"><el-input v-model="form.name" /></el-form-item>
      <el-form-item label="实训地点">
        <el-select v-model="form.lab" style="width: 100%">
          <el-option v-for="l in base.labList" :key="l.id" :label="l.name" :value="l.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="班级">
        <el-select v-model="form.className" style="width: 100%">
          <el-option v-for="o in classes" :key="o.id" :label="o.name" :value="o.name" />
        </el-select>
      </el-form-item>
      <el-form-item label="时长(分钟)"><el-input-number v-model="form.duration" :min="30" :step="30" /></el-form-item>
      <el-form-item label="指导教师"><el-input v-model="form.teacher" /></el-form-item>
      <el-form-item label="截止时间">
        <el-date-picker v-model="form.deadline" type="datetime" value-format="YYYY-MM-DD HH:mm" style="width: 100%" />
      </el-form-item>
      <el-form-item label="报告模板">
        <el-select v-model="form.reportTemplateId" style="width: 100%">
          <el-option v-for="t in training.templates" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>

      <el-divider content-position="left">标准化流程步骤</el-divider>

      <div class="steps-editor">
        <div v-for="(step, idx) in form.steps" :key="step.id" class="step-card">
          <div class="step-head">
            <strong>步骤 {{ idx + 1 }}</strong>
            <div class="step-actions">
              <el-button link :disabled="idx === 0" @click="moveStep(idx, -1)">上移</el-button>
              <el-button link :disabled="idx === form.steps.length - 1" @click="moveStep(idx, 1)">下移</el-button>
              <el-button link type="danger" @click="removeStep(idx)">删除</el-button>
            </div>
          </div>
          <el-form-item label="步骤标题" label-width="80px">
            <el-input v-model="step.title" placeholder="如：试切对刀" />
          </el-form-item>
          <el-form-item label="步骤说明" label-width="80px">
            <el-input v-model="step.content" type="textarea" :rows="2" />
          </el-form-item>
          <el-form-item label="参考资料" label-width="80px">
            <div class="mats">
              <div v-for="(m, mi) in step.materials" :key="mi" class="mat-row">
                <el-select v-model="m.type" style="width: 100px">
                  <el-option label="图文" value="图文" />
                  <el-option label="视频" value="视频" />
                  <el-option label="文档" value="文档" />
                </el-select>
                <el-input v-model="m.name" placeholder="资料名称" style="flex: 1" />
                <el-button link type="danger" @click="step.materials.splice(mi, 1)">删</el-button>
              </div>
              <el-button size="small" @click="addMaterial(step)">添加资料引用</el-button>
            </div>
          </el-form-item>
        </div>
        <el-button type="primary" plain @click="addStep">添加步骤</el-button>
      </div>

      <el-form-item style="margin-top: 16px">
        <el-button type="primary" @click="save">下发任务</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive } from 'vue'
import { ElMessage } from 'element-plus'
import { useBaseStore } from '@/stores/base'
import { useTrainingStore } from '@/stores/training'
import { useAuthStore } from '@/stores/auth'
import { PLACEHOLDER, type TaskStep, type TaskMaterial } from '@/mock/training'

const base = useBaseStore()
const training = useTrainingStore()
const auth = useAuthStore()
const classes = computed(() => base.orgs.filter((o) => o.type === 'class'))

function newStep(n: number): TaskStep {
  return {
    id: `ns${Date.now()}_${n}`,
    title: '',
    content: '',
    materials: [],
    photos: [],
  }
}

function defaultMaterial(type: TaskMaterial['type'] = '图文'): TaskMaterial {
  const map = {
    图文: { name: '示意图', url: PLACEHOLDER.img1 },
    视频: { name: '操作示范', url: PLACEHOLDER.video },
    文档: { name: '操作说明', url: '#', content: '此处为文档预览正文。' },
  } as const
  const d = map[type]
  return { type, name: d.name, url: d.url, content: 'content' in d ? d.content : undefined }
}

const form = reactive({
  name: '',
  lab: '数控车床实训室',
  className: '数控2301',
  duration: 90,
  teacher: auth.current?.name || '赵文博',
  deadline: '2026-09-25 18:00',
  reportTemplateId: training.templates[0]?.id || 'rt1',
  steps: [
    {
      id: 'ns1',
      title: '安全确认与开机',
      content: '检查急停、防护罩与润滑状态。',
      materials: [defaultMaterial('图文'), defaultMaterial('视频')],
      photos: [],
    },
    {
      id: 'ns2',
      title: '主体操作',
      content: '按指导完成主体步骤。',
      materials: [defaultMaterial('文档')],
      photos: [],
    },
  ] as TaskStep[],
})

function addStep() {
  form.steps.push(newStep(form.steps.length + 1))
}

function removeStep(idx: number) {
  if (form.steps.length <= 1) return ElMessage.warning('至少保留一个步骤')
  form.steps.splice(idx, 1)
}

function moveStep(idx: number, dir: number) {
  const to = idx + dir
  if (to < 0 || to >= form.steps.length) return
  const arr = form.steps
  ;[arr[idx], arr[to]] = [arr[to], arr[idx]]
}

function addMaterial(step: TaskStep) {
  step.materials.push(defaultMaterial('图文'))
}

function save() {
  if (!form.name) return ElMessage.warning('请填写任务名称')
  if (form.steps.some((s) => !s.title)) return ElMessage.warning('请填写所有步骤标题')
  // 按类型补全预览 URL
  const steps = form.steps.map((s) => ({
    ...s,
    materials: s.materials.map((m) => {
      if (m.type === '图文' && (!m.url || m.url === '#')) return { ...m, url: PLACEHOLDER.img1 }
      if (m.type === '视频' && (!m.url || m.url === '#')) return { ...m, url: PLACEHOLDER.video }
      if (m.type === '文档' && !m.content) return { ...m, content: `${m.name} 预览正文。` }
      return m
    }),
  }))
  training.assignTask({
    name: form.name,
    lab: form.lab,
    className: form.className,
    deadline: form.deadline,
    teacher: form.teacher,
    duration: form.duration,
    reportTemplateId: form.reportTemplateId,
    steps,
  })
  ElMessage.success('任务已下发')
  form.name = ''
}
</script>

<style scoped>
.steps-editor {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 8px;
}
.step-card {
  border: 1px solid #E5E7EB;
  border-radius: 10px;
  padding: 12px;
  background: #F9FAFB;
}
.step-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}
.step-actions {
  display: flex;
  gap: 4px;
}
.mats {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.mat-row {
  display: flex;
  gap: 8px;
  align-items: center;
  flex-wrap: wrap;
}
</style>
