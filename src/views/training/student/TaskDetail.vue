<template>
  <div v-if="task">
    <div class="page-card">
      <div class="toolbar">
        <h2 class="page-title" style="margin: 0; flex: 1">{{ task.name }}</h2>
        <el-button v-if="!training.helpActive" type="warning" @click="askHelp">远程求助</el-button>
        <el-button v-else type="danger" @click="training.endHelp()">结束求助</el-button>
        <el-button @click="$router.push(`/training/report/${task.id}`)">填写报告</el-button>
      </div>
      <p class="muted">{{ task.lab }} · {{ task.teacher }} · 截止 {{ task.deadline }}</p>
      <el-alert
        v-if="training.helpActive"
        title="远程求助进行中，教师端「远程协作」可见待接通请求并可一键接通。"
        type="warning"
        :closable="false"
        style="margin: 8px 0 12px"
      />
    </div>

    <el-steps :active="activeStep" align-center style="margin: 16px 0">
      <el-step v-for="(s, i) in task.steps" :key="s.id" :title="`步骤 ${i + 1}`" :description="s.title" />
    </el-steps>

    <div class="page-card" v-for="(step, idx) in task.steps" :key="step.id" style="margin-bottom: 12px">
      <h3 style="margin-top: 0">步骤 {{ idx + 1 }}：{{ step.title }}</h3>
      <p>{{ step.content }}</p>
      <h4>参考资料</h4>
      <div class="mats">
        <el-tag
          v-for="m in step.materials"
          :key="m.name"
          class="mat"
          effect="plain"
          @click="preview(m)"
        >
          {{ m.type }} · {{ m.name }}
        </el-tag>
      </div>
      <div class="toolbar" style="margin-top: 12px">
        <el-button type="primary" @click="training.addPhoto(task!.id, step.id)">现场拍照关联</el-button>
        <el-button @click="activeStep = idx">定位此步</el-button>
      </div>
      <div v-if="step.photos.length" class="photos">
        <el-tag v-for="p in step.photos" :key="p" type="success">{{ p }}</el-tag>
      </div>
    </div>

    <el-dialog v-model="previewVisible" :title="previewItem?.name" width="640px">
      <div class="preview-box">
        <p class="muted">资料类型：{{ previewItem?.type }}</p>
        <div v-if="previewItem?.type === '图文'" class="preview-canvas">
          <img :src="previewItem.url" :alt="previewItem.name" />
        </div>
        <div v-else-if="previewItem?.type === '视频'" class="preview-canvas">
          <video :src="previewItem.url" controls playsinline />
        </div>
        <div v-else-if="previewItem?.type === '文档'" class="preview-canvas doc">
          <pre>{{ previewItem.content || '文档预览正文（模拟）' }}</pre>
        </div>
      </div>
      <template #footer>
        <el-button type="primary" @click="previewVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
  <el-empty v-else description="任务不存在" />
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useRoute } from 'vue-router'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'
import type { TaskMaterial } from '@/mock/training'

const route = useRoute()
const training = useTrainingStore()
const activeStep = ref(0)
const previewVisible = ref(false)
const previewItem = ref<TaskMaterial | null>(null)

const task = computed(() => training.tasks.find((t) => t.id === route.params.id))

function askHelp() {
  training.startHelp(task.value!.id)
  ElMessage.success('已发起远程求助，请等待教师接通')
}

function preview(m: TaskMaterial) {
  previewItem.value = m
  previewVisible.value = true
}
</script>

<style scoped>
.mats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mat {
  cursor: pointer;
}
.photos {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.preview-canvas {
  min-height: 200px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #F9FAFB;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}
.preview-canvas img,
.preview-canvas video {
  max-width: 100%;
  max-height: 360px;
  display: block;
}
.preview-canvas.doc {
  display: block;
  padding: 16px;
  text-align: left;
}
.preview-canvas.doc pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.6;
  color: #1F2937;
}
</style>
