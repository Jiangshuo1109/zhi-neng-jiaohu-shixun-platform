<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">远程协作</h2>
      <el-select :model-value="training.sessionStudentId" style="width: 150px" @change="onSelectStudent">
        <el-option v-for="s in training.online" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
    </div>

    <!-- 待接通求助收件箱 -->
    <el-alert
      v-for="h in training.pendingHelps"
      :key="h.id"
      type="warning"
      :closable="false"
      style="margin-bottom: 10px"
    >
      <template #title>
        <div class="help-inbox">
          <span>待接通求助：{{ h.studentName }} · {{ h.taskName }} · {{ h.time }}</span>
          <el-button type="warning" size="small" @click="accept(h.id)">一键接通</el-button>
        </div>
      </template>
    </el-alert>

    <div class="collab">
      <div
        class="viewport"
        :class="{ freeze: training.freezeOn }"
        @click="onViewportClick"
      >
        <div class="badge">{{ current?.name }} · {{ voiceText }}</div>
        <div class="feed" ref="feedRef">
          <span v-if="training.activeTool === 'laser'" class="laser">✦</span>
          <span v-if="training.activeTool === 'whiteboard'" class="board">画板层开启</span>
          <span v-if="training.activeTool === 'share'" class="share">屏幕共享中</span>
          <span v-if="training.freezeOn" class="freeze-hint">冻屏中 · 点击画面落标记点</span>
          学生端画面 Mock
          <div
            v-for="m in training.freezeMarkers"
            :key="m.id"
            class="marker"
            :style="{ left: m.x + '%', top: m.y + '%' }"
            :title="m.note"
          >
            <span class="pin">●</span>
            <span class="pin-label">{{ m.note }}</span>
          </div>
        </div>
        <div class="voice-bar" @click.stop>
          <el-button size="small" type="primary" @click="training.toggleVoice()">
            {{ voiceBtn }}
          </el-button>
          <el-button size="small" @click="training.hangup()">挂断</el-button>
          <el-tag size="small">双向语音 UI</el-tag>
          <el-tag v-if="training.freezeOn" size="small" type="warning">标记 {{ training.freezeMarkers.length }}</el-tag>
        </div>
      </div>

      <div class="tools">
        <h4>协作工具</h4>
        <el-button
          v-for="t in toolList"
          :key="t.key"
          :type="isToolActive(t.key) ? 'primary' : 'default'"
          style="width: 100%; margin-bottom: 8px"
          @click="training.setTool(t.key)"
        >
          {{ t.label }}
        </el-button>
        <el-button
          v-if="training.freezeOn && training.freezeMarkers.length"
          style="width: 100%; margin-bottom: 8px"
          @click="training.clearFreezeMarkers()"
        >
          清除标记点
        </el-button>
        <el-divider />
        <h4>资料预览</h4>
        <el-button
          v-for="mat in collabMats"
          :key="mat.name"
          style="width: 100%; margin-bottom: 6px"
          @click="openMat(mat)"
        >
          {{ mat.type }} · {{ mat.name }}
        </el-button>
        <el-divider />
        <h4>标注 / 抓图记录</h4>
        <el-scrollbar height="140px">
          <div v-for="(a, i) in training.annotations" :key="'a' + i" class="muted line">{{ a }}</div>
          <div v-for="(c, i) in training.captures" :key="'c' + i" class="muted line">{{ c }}</div>
          <div v-if="!training.annotations.length && !training.captures.length" class="muted">暂无记录</div>
        </el-scrollbar>
      </div>
    </div>

    <el-dialog v-model="matVisible" :title="previewMat?.name || '协作资料预览'" width="640px">
      <div v-if="previewMat?.type === '图文'" class="mat-preview">
        <img :src="previewMat.url" :alt="previewMat.name" style="max-width: 100%; border-radius: 8px" />
      </div>
      <div v-else-if="previewMat?.type === '视频'" class="mat-preview">
        <video :src="previewMat.url" controls style="width: 100%; border-radius: 8px; max-height: 360px" />
      </div>
      <div v-else-if="previewMat?.type === '文档'" class="mat-preview doc">
        <pre>{{ previewMat.content || '文档内容预览' }}</pre>
      </div>
      <template #footer>
        <el-button type="primary" @click="matVisible = false">关闭</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTrainingStore, type CollabTool } from '@/stores/training'
import { PLACEHOLDER, type TaskMaterial } from '@/mock/training'

const training = useTrainingStore()
const matVisible = ref(false)
const previewMat = ref<TaskMaterial | null>(null)
const feedRef = ref<HTMLElement | null>(null)
const current = computed(() => training.online.find((s) => s.id === training.sessionStudentId))

const collabMats: TaskMaterial[] = [
  { type: '图文', name: '对刀示意图', url: PLACEHOLDER.img2 },
  { type: '视频', name: '操作示范视频', url: PLACEHOLDER.video },
  {
    type: '文档',
    name: '协作要点说明',
    url: '#',
    content: '1. 冻屏后点击画面落标记\n2. 激光笔用于实时指向\n3. 抓图可保存当前关键\n4. 画板支持叠加笔迹讲解',
  },
]

const toolList: { key: CollabTool; label: string }[] = [
  { key: 'freeze', label: '冻屏标记' },
  { key: 'laser', label: '激光笔' },
  { key: 'capture', label: '抓图' },
  { key: 'whiteboard', label: '画板' },
  { key: 'share', label: '屏幕共享' },
]

function isToolActive(key: CollabTool) {
  if (key === 'freeze') return training.freezeOn
  return training.activeTool === key
}

const voiceText = computed(() => {
  const m = { idle: '未接通', ringing: '呼叫中…', connected: '通话中', muted: '已静音' }
  return m[training.voice]
})

const voiceBtn = computed(() => {
  const m = { idle: '接通', ringing: '对方振铃·点按接通', connected: '静音', muted: '取消静音' }
  return m[training.voice]
})

function onSelectStudent(id: string) {
  training.selectStudent(id)
}

function accept(helpId: string) {
  training.acceptHelp(helpId)
  ElMessage.success('已接通远程求助会话')
}

function onViewportClick(e: MouseEvent) {
  if (!training.freezeOn) return
  const el = feedRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  if (x < 0 || x > 100 || y < 0 || y > 100) return
  training.addFreezeMarker(x, y)
}

function openMat(m: TaskMaterial) {
  previewMat.value = m
  matVisible.value = true
}
</script>

<style scoped>
.help-inbox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.collab {
  display: grid;
  grid-template-columns: 1fr 240px;
  gap: 12px;
}
@media (max-width: 900px) {
  .collab {
    grid-template-columns: 1fr;
  }
}
.viewport {
  position: relative;
  background: #0f172a;
  border-radius: 12px;
  min-height: 360px;
  color: #fff;
  overflow: hidden;
  cursor: default;
}
.viewport.freeze {
  cursor: crosshair;
}
.viewport.freeze .feed {
  filter: grayscale(0.3) brightness(0.85);
  outline: 3px solid #F59E0B;
  outline-offset: -3px;
}
.feed {
  height: 360px;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  background: radial-gradient(circle at 30% 40%, #334155, #0f172a 70%);
  color: #94a3b8;
  user-select: none;
}
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
  background: rgba(31, 75, 153, 0.9);
  padding: 4px 10px;
  border-radius: 999px;
  font-size: 12px;
}
.voice-bar {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  align-items: center;
  z-index: 3;
  flex-wrap: wrap;
}
.tools {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 12px;
  background: #fff;
}
.tools h4 {
  margin: 0 0 8px;
  font-size: 14px;
}
.line {
  margin-bottom: 4px;
}
.laser {
  position: absolute;
  color: #ef4444;
  font-size: 28px;
  top: 40%;
  left: 55%;
  animation: pulse 1s infinite;
  z-index: 2;
}
.board,
.share,
.freeze-hint {
  position: absolute;
  top: 16px;
  right: 16px;
  background: rgba(15, 118, 110, 0.85);
  padding: 4px 10px;
  border-radius: 6px;
  color: #fff;
  font-size: 12px;
  z-index: 2;
}
.freeze-hint {
  background: rgba(245, 158, 11, 0.9);
  top: 48px;
}
.marker {
  position: absolute;
  transform: translate(-50%, -50%);
  z-index: 4;
  pointer-events: none;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.pin {
  color: #ef4444;
  font-size: 22px;
  text-shadow: 0 0 4px #000;
  line-height: 1;
}
.pin-label {
  background: rgba(185, 28, 28, 0.9);
  color: #fff;
  font-size: 10px;
  padding: 1px 6px;
  border-radius: 4px;
  white-space: nowrap;
  margin-top: 2px;
}
.mat-preview {
  min-height: 160px;
}
.mat-preview.doc {
  background: #F9FAFB;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  padding: 16px;
}
.mat-preview.doc pre {
  margin: 0;
  white-space: pre-wrap;
  font-family: inherit;
  line-height: 1.6;
  color: #1F2937;
}
@keyframes pulse {
  50% { transform: scale(1.2); opacity: 0.7; }
}
</style>
