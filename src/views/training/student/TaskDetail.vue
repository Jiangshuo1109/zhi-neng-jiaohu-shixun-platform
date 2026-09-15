<template>
  <div v-if="task">
    <div class="page-card">
      <div class="toolbar">
        <h2 class="page-title" style="margin: 0; flex: 1">{{ task.name }}</h2>
        <el-badge v-if="training.helpActive" is-dot class="help-badge">
          <el-button type="danger" @click="training.endHelp()">结束求助</el-button>
        </el-badge>
        <el-button v-else type="warning" @click="askHelp">远程求助</el-button>
        <el-button @click="$router.push(`/training/report/${task.id}`)">填写报告</el-button>
      </div>
      <p class="muted">{{ task.lab }} · {{ task.teacher }} · 截止 {{ task.deadline }}</p>
      <el-alert
        v-if="training.helpActive"
        title="远程求助进行中，教师端「在线学生 / 远程协作」可见待接通请求并可一键接通。"
        type="warning"
        show-icon
        :closable="false"
        class="help-alert"
      />
    </div>

    <el-steps :active="activeStep" align-center style="margin: 16px 0">
      <el-step v-for="(s, i) in task.steps" :key="s.id" :title="`步骤 ${i + 1}`" :description="s.title" />
    </el-steps>

    <div class="page-card" v-for="(step, idx) in task.steps" :key="step.id" style="margin-bottom: 12px">
      <h3 style="margin-top: 0">步骤 {{ idx + 1 }}：{{ step.title }}</h3>
      <p>{{ step.content }}</p>
      <h4>参考资料</h4>
      <div v-if="step.materials.length" class="mats">
        <el-tag
          v-for="m in step.materials"
          :key="m.name"
          class="mat"
          effect="plain"
          type="primary"
          @click="preview(m)"
        >
          {{ m.type }} · {{ m.name }}
        </el-tag>
      </div>
      <el-empty v-else description="本步骤暂无参考资料" :image-size="64" />
      <div class="toolbar" style="margin-top: 12px">
        <el-button type="primary" @click="onPhoto(task!.id, step.id)">现场拍照关联</el-button>
        <el-button @click="activeStep = idx">定位此步</el-button>
      </div>
      <div v-if="step.photos.length" class="photos">
        <el-tag v-for="p in step.photos" :key="p" type="success">{{ p }}</el-tag>
      </div>
    </div>

    <el-dialog v-model="previewVisible" :title="previewItem?.name || '资料预览'" width="640px" destroy-on-close>
      <div v-loading="previewLoading" class="preview-box">
        <p class="muted">资料类型：{{ previewItem?.type }}</p>
        <template v-if="previewItem">
          <div v-if="previewItem.type === '图文'" class="preview-canvas">
            <img v-if="previewItem.url && previewItem.url !== '#'" :src="previewItem.url" :alt="previewItem.name" @load="onLoaded" @error="onEmpty" />
            <el-empty v-else description="图片资源缺失，暂无法预览" :image-size="80" />
          </div>
          <div v-else-if="previewItem.type === '视频'" class="preview-canvas">
            <video
              v-if="previewItem.url && previewItem.url !== '#'"
              :src="previewItem.url"
              controls
              playsinline
              @loadeddata="onLoaded"
              @error="onEmpty"
            />
            <el-empty v-else description="视频资源缺失，暂无法预览" :image-size="80" />
          </div>
          <div v-else-if="previewItem.type === '文档'" class="preview-canvas doc">
            <pre v-if="previewItem.content">{{ previewItem.content }}</pre>
            <el-empty v-else description="文档正文缺失，暂无法预览" :image-size="80" />
          </div>
          <el-empty v-else description="未知资料类型" :image-size="80" />
        </template>
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
const previewLoading = ref(false)
const previewItem = ref<TaskMaterial | null>(null)

const task = computed(() => training.tasks.find((t) => t.id === route.params.id))

function askHelp() {
  training.startHelp(task.value!.id)
  ElMessage.success('已发起远程求助，请等待教师接通')
}

function onPhoto(taskId: string, stepId: string) {
  training.addPhoto(taskId, stepId)
  ElMessage.success('已关联现场照片')
}

function preview(m: TaskMaterial) {
  previewItem.value = m
  previewVisible.value = true
  previewLoading.value = true
  ElMessage.info(`正在打开「${m.name}」…`)
  const needsMedia = m.type === '图文' || m.type === '视频'
  const missing =
    (needsMedia && (!m.url || m.url === '#')) ||
    (m.type === '文档' && !m.content)
  if (missing) {
    previewLoading.value = false
    ElMessage.warning('资料内容缺失，无法完整预览')
    return
  }
  if (m.type === '文档') {
    previewLoading.value = false
    ElMessage.success('资料预览已打开')
  }
  // 图文/视频在 load 回调里结束 loading
  setTimeout(() => {
    if (previewLoading.value) {
      previewLoading.value = false
      ElMessage.success('资料预览已打开')
    }
  }, 800)
}

function onLoaded() {
  if (!previewLoading.value) return
  previewLoading.value = false
  ElMessage.success('资料预览已打开')
}

function onEmpty() {
  previewLoading.value = false
  ElMessage.warning('资源加载失败')
}
</script>

<style scoped>
.help-badge {
  margin-right: 8px;
}
.help-alert {
  margin: 8px 0 12px;
  border: 1px solid #F59E0B;
}
.mats {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.mat {
  cursor: pointer;
}
.mat:hover {
  opacity: 0.85;
}
.photos {
  margin-top: 8px;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
}
.preview-box {
  min-height: 180px;
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
