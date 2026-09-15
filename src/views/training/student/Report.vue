<template>
  <div class="page-card" v-if="task">
    <h2 class="page-title">实验报告 · {{ task.name }}</h2>
    <p class="muted">模板：{{ template?.name || task.reportTemplate }}</p>

    <el-form v-if="template" label-position="top">
      <el-form-item
        v-for="f in template.fields"
        :key="f.id"
        :label="f.label + (f.required ? ' *' : '')"
      >
        <el-input
          v-if="f.type === '文本填空'"
          v-model="values[f.id]"
          type="textarea"
          :rows="3"
          :placeholder="`请填写${f.label}`"
        />
        <div v-else class="upload-block">
          <div class="upload-actions">
            <el-button type="primary" @click="mockUpload(f.id)">模拟上传图片</el-button>
            <el-button v-if="values[f.id]" @click="values[f.id] = ''">清除</el-button>
          </div>
          <div v-if="values[f.id]" class="preview">
            <img :src="values[f.id]" :alt="f.label" />
          </div>
          <div v-else class="preview empty">尚未上传，点击上方按钮模拟上传</div>
        </div>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit">提交报告</el-button>
        <el-button @click="saveDraft">课后修改保存</el-button>
      </el-form-item>
    </el-form>

    <el-alert v-else title="未找到关联报告模板" type="warning" :closable="false" />

    <el-descriptions v-if="task.score || task.aiScore" :column="2" border style="margin-top: 16px">
      <el-descriptions-item label="人工评分">{{ task.score ?? '-' }}</el-descriptions-item>
      <el-descriptions-item label="AI 评分">{{ task.aiScore ?? '-' }}</el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'
import { PLACEHOLDER } from '@/mock/training'

const route = useRoute()
const training = useTrainingStore()
const task = computed(() => training.tasks.find((t) => t.id === route.params.id))
const template = computed(() =>
  training.templates.find((t) => t.id === task.value?.reportTemplateId) ||
  training.templates.find((t) => t.name === task.value?.reportTemplate),
)

const values = reactive<Record<string, string>>({})

const mockImages = [PLACEHOLDER.student, PLACEHOLDER.img2, PLACEHOLDER.img3, PLACEHOLDER.img5]

watch(
  [task, template],
  () => {
    Object.keys(values).forEach((k) => delete values[k])
    if (!template.value) return
    template.value.fields.forEach((f) => {
      values[f.id] = task.value?.reportFields?.[f.id] || ''
    })
  },
  { immediate: true },
)

function mockUpload(fieldId: string) {
  const idx = Object.keys(values).filter((k) => values[k].startsWith('http')).length
  values[fieldId] = mockImages[idx % mockImages.length]
  ElMessage.success('图片已上传（本地模拟）')
}

function buildContent() {
  if (!template.value) return ''
  return template.value.fields
    .map((f) => {
      if (f.type === '图片上传') return `${f.label}：[已上传图片]`
      return `${f.label}：${values[f.id] || ''}`
    })
    .join('\n')
}

function submit() {
  if (!task.value || !template.value) return
  for (const f of template.value.fields) {
    if (f.required && !values[f.id]) {
      ElMessage.warning(`请完成必填项：${f.label}`)
      return
    }
  }
  training.submitReport(task.value.id, { ...values }, buildContent())
  ElMessage.success('报告已提交')
}

function saveDraft() {
  if (!task.value) return
  task.value.reportFields = { ...values }
  task.value.reportContent = buildContent()
  ElMessage.success('已保存修改')
}
</script>

<style scoped>
.upload-block {
  width: 100%;
}
.upload-actions {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}
.preview {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  background: #F9FAFB;
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.preview.empty {
  color: #6B7280;
  font-size: 13px;
}
.preview img {
  max-width: 100%;
  max-height: 280px;
  display: block;
}
</style>
