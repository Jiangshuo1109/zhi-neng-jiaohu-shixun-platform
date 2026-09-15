<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">
        远程协作
        <el-badge
          v-if="training.pendingHelps.length"
          :value="training.pendingHelps.length"
          class="pending-badge"
        >
          <el-tag type="danger" effect="dark" size="small">待接通</el-tag>
        </el-badge>
        <el-tag v-if="training.voice === 'connected' || training.voice === 'muted'" type="success" effect="dark" size="small" style="margin-left: 8px">
          已接通
        </el-tag>
        <el-tag v-if="sharing" type="warning" effect="dark" size="small" style="margin-left: 8px" class="share-pill">
          共享中
        </el-tag>
      </h2>
      <el-select :model-value="training.sessionStudentId" style="width: 150px" @change="onSelectStudent">
        <el-option v-for="s in training.online" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
    </div>

    <div v-if="training.pendingHelps.length" class="help-panel">
      <el-alert
        v-for="h in training.pendingHelps"
        :key="h.id"
        type="error"
        show-icon
        :closable="false"
        class="help-alert"
      >
        <template #title>
          <div class="help-inbox">
            <span>待接通求助：<strong>{{ h.studentName }}</strong> · {{ h.taskName }} · {{ h.time }}</span>
            <el-button type="danger" size="small" @click="accept(h.id)">一键接通</el-button>
          </div>
        </template>
      </el-alert>
    </div>

    <el-alert
      v-if="training.freezeOn"
      title="冻屏模式已开启 — 光标为十字准星，点击画面可落红色编号标记点"
      type="warning"
      show-icon
      :closable="false"
      class="freeze-banner"
    />

    <div class="collab">
      <div
        class="viewport"
        :class="{ freeze: training.freezeOn, sharing }"
        @click="onViewportClick"
      >
        <div class="badge">{{ current?.name }} · {{ voiceText }}</div>
        <div v-if="sharing" class="share-status-pill">共享中</div>
        <div class="feed" ref="feedRef">
          <span v-if="training.activeTool === 'laser'" class="laser">✦</span>
          <span v-if="training.activeTool === 'whiteboard'" class="board">画板层开启</span>
          <div v-if="sharing" class="share-mock">
            <div class="share-mock-bar">屏幕共享（模拟）</div>
            <div class="share-mock-body">课件 / 桌面画面 Mock</div>
          </div>
          <span v-if="training.freezeOn" class="freeze-hint">冻屏中 · 点击落点</span>
          <template v-if="!sharing">学生端画面 Mock</template>
          <div
            v-for="(m, idx) in training.freezeMarkers"
            :key="m.id"
            class="marker"
            :style="{ left: m.x + '%', top: m.y + '%' }"
            :title="m.note"
          >
            <span class="pin"><i class="pin-num">{{ idx + 1 }}</i></span>
            <span class="pin-label">{{ m.note }}</span>
          </div>
        </div>
        <div class="voice-bar" @click.stop>
          <el-button size="small" type="primary" @click="onToggleVoice">
            {{ voiceBtn }}
          </el-button>
          <el-button size="small" @click="onHangup">挂断</el-button>
          <el-tag size="small" :type="voiceTagType">{{ voiceText }}</el-tag>
          <el-tag v-if="training.freezeOn" size="small" type="warning">标记 {{ training.freezeMarkers.length }}</el-tag>
          <el-tag v-if="sharing" size="small" type="warning" effect="dark">共享中</el-tag>
        </div>
      </div>

      <div class="tools">
        <h4>协作工具</h4>
        <el-button
          v-for="t in toolList"
          :key="t.key"
          :type="isToolActive(t.key) ? 'primary' : 'default'"
          style="width: 100%; margin-bottom: 8px"
          @click="onTool(t.key)"
        >
          <template v-if="t.key === 'share'">
            {{ sharing ? '停止屏幕共享' : '屏幕共享' }}
          </template>
          <template v-else-if="t.key === 'freeze'">
            {{ training.freezeOn ? '退出冻屏' : '冻屏标记' }}
          </template>
          <template v-else>{{ t.label }}</template>
        </el-button>

        <div v-if="training.freezeOn" class="marker-list">
          <div class="marker-list-hd">
            <span>标记点列表</span>
            <el-button
              v-if="training.freezeMarkers.length"
              link
              type="danger"
              size="small"
              @click="clearMarkers"
            >
              全部清除
            </el-button>
          </div>
          <el-empty v-if="!training.freezeMarkers.length" description="点击画面落点" :image-size="48" />
          <div v-for="(m, idx) in training.freezeMarkers" :key="m.id" class="marker-row">
            <span class="dot">{{ idx + 1 }}</span>
            <span>{{ m.note }} · ({{ Math.round(m.x) }}%, {{ Math.round(m.y) }}%)</span>
          </div>
        </div>

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

    <el-dialog v-model="matVisible" :title="previewMat?.name || '协作资料预览'" width="640px" destroy-on-close>
      <div v-loading="matLoading" class="mat-preview-wrap">
        <template v-if="previewMat">
          <div v-if="previewMat.type === '图文'" class="mat-preview">
            <img
              v-if="previewMat.url && previewMat.url !== '#'"
              :src="previewMat.url"
              :alt="previewMat.name"
              style="max-width: 100%; border-radius: 8px"
              @load="matLoaded"
            />
            <el-empty v-else description="图片资源缺失" :image-size="80" />
          </div>
          <div v-else-if="previewMat.type === '视频'" class="mat-preview">
            <video
              v-if="previewMat.url && previewMat.url !== '#'"
              :src="previewMat.url"
              controls
              style="width: 100%; border-radius: 8px; max-height: 360px"
              @loadeddata="matLoaded"
            />
            <el-empty v-else description="视频资源缺失" :image-size="80" />
          </div>
          <div v-else-if="previewMat.type === '文档'" class="mat-preview doc">
            <pre v-if="previewMat.content">{{ previewMat.content }}</pre>
            <el-empty v-else description="文档正文缺失" :image-size="80" />
          </div>
        </template>
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
const matLoading = ref(false)
const previewMat = ref<TaskMaterial | null>(null)
const feedRef = ref<HTMLElement | null>(null)
const current = computed(() => training.online.find((s) => s.id === training.sessionStudentId))
const sharing = computed(() => training.activeTool === 'share')

const collabMats: TaskMaterial[] = [
  { type: '图文', name: '对刀示意图', url: PLACEHOLDER.img2 },
  { type: '视频', name: '操作示范视频', url: PLACEHOLDER.video },
  {
    type: '文档',
    name: '协作要点说明',
    url: 'doc://collab-notes',
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
  const m = { idle: '未接通', ringing: '呼叫中…', connected: '已接通', muted: '已静音' }
  return m[training.voice]
})

const voiceBtn = computed(() => {
  const m = { idle: '接通', ringing: '对方振铃·点按接通', connected: '静音', muted: '取消静音' }
  return m[training.voice]
})

const voiceTagType = computed(() => {
  if (training.voice === 'connected') return 'success'
  if (training.voice === 'ringing') return 'warning'
  if (training.voice === 'muted') return 'info'
  return 'info'
})

function onSelectStudent(id: string) {
  training.selectStudent(id)
}

function accept(helpId: string) {
  const h = training.pendingHelps.find((x) => x.id === helpId)
  training.acceptHelp(helpId)
  ElMessage.success(`已接通「${h?.studentName || '学生'}」，状态：已接通`)
}

function onToggleVoice() {
  const before = training.voice
  training.toggleVoice()
  if (before === 'idle') ElMessage.info('正在呼叫…')
  else if (before === 'ringing') ElMessage.success('已接通')
  else if (before === 'connected') ElMessage.info('已静音')
  else ElMessage.success('已取消静音')
}

function onHangup() {
  training.hangup()
  ElMessage.info('已挂断')
}

function onTool(key: CollabTool) {
  const wasShare = training.activeTool === 'share'
  const wasFreeze = training.freezeOn
  training.setTool(key)
  if (key === 'freeze') {
    ElMessage[training.freezeOn ? 'warning' : 'info'](
      training.freezeOn ? '冻屏已开启，点击画面落点' : '已退出冻屏',
    )
  } else if (key === 'share') {
    if (!wasShare && training.activeTool === 'share') {
      ElMessage.success('屏幕共享已开始（模拟）')
    } else if (wasShare && training.activeTool !== 'share') {
      ElMessage.info('屏幕共享已停止')
    }
  } else if (key === 'capture') {
    ElMessage.success('已抓图')
  } else if (key === 'laser') {
    ElMessage.info(training.activeTool === 'laser' ? '激光笔已开启' : '激光笔已关闭')
  } else if (key === 'whiteboard') {
    ElMessage.info(training.activeTool === 'whiteboard' ? '画板已开启' : '画板已关闭')
  }
  void wasFreeze
}

function onViewportClick(e: MouseEvent) {
  if (!training.freezeOn) return
  const el = feedRef.value
  if (!el) return
  const rect = el.getBoundingClientRect()
  const x = ((e.clientX - rect.left) / rect.width) * 100
  const y = ((e.clientY - rect.top) / rect.height) * 100
  if (x < 0 || x > 100 || y < 0 || y > 100) return
  const m = training.addFreezeMarker(x, y)
  if (m) ElMessage.success(`已落点 ${m.note}`)
}

function clearMarkers() {
  training.clearFreezeMarkers()
  ElMessage.info('已清除全部标记点')
}

function openMat(m: TaskMaterial) {
  previewMat.value = m
  matVisible.value = true
  matLoading.value = true
  ElMessage.info(`正在打开「${m.name}」…`)
  if (m.type === '文档') {
    matLoading.value = false
    if (m.content) ElMessage.success('资料预览已打开')
    else ElMessage.warning('文档正文缺失')
    return
  }
  if (!m.url || m.url === '#') {
    matLoading.value = false
    ElMessage.warning('资料资源缺失')
    return
  }
  setTimeout(() => {
    if (matLoading.value) {
      matLoading.value = false
      ElMessage.success('资料预览已打开')
    }
  }, 800)
}

function matLoaded() {
  if (!matLoading.value) return
  matLoading.value = false
  ElMessage.success('资料预览已打开')
}
</script>

<style scoped>
.pending-badge {
  margin-left: 10px;
  vertical-align: middle;
}
.help-panel {
  margin-bottom: 10px;
}
.help-alert {
  margin-bottom: 8px;
  border: 2px solid #F56C6C;
  box-shadow: 0 0 0 3px rgba(245, 108, 108, 0.12);
}
.help-inbox {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}
.freeze-banner {
  margin-bottom: 12px;
  border: 2px solid #F59E0B;
  font-weight: 600;
}
.share-pill {
  animation: pulse 1.4s infinite;
}
.collab {
  display: grid;
  grid-template-columns: 1fr 260px;
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
  box-shadow: inset 0 0 0 3px #F59E0B;
}
.viewport.freeze .feed {
  filter: grayscale(0.35) brightness(0.8);
  outline: 3px solid #F59E0B;
  outline-offset: -3px;
}
.viewport.sharing .feed {
  background: linear-gradient(145deg, #1e3a5f, #0f172a 60%);
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
.share-status-pill {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 5;
  background: #D97706;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  padding: 4px 12px;
  border-radius: 999px;
  box-shadow: 0 0 0 3px rgba(217, 119, 6, 0.35);
}
.share-mock {
  position: absolute;
  inset: 24px 40px 56px;
  border: 1px dashed rgba(255, 255, 255, 0.35);
  border-radius: 8px;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  z-index: 1;
}
.share-mock-bar {
  background: #1F4B99;
  color: #fff;
  font-size: 12px;
  padding: 6px 10px;
}
.share-mock-body {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #cbd5e1;
  font-size: 14px;
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
  background: rgba(245, 158, 11, 0.95);
  top: 48px;
  font-weight: 700;
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
  width: 26px;
  height: 26px;
  border-radius: 50% 50% 50% 0;
  transform: rotate(-45deg);
  background: #ef4444;
  color: #fff;
  font-size: 12px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.45);
  border: 2px solid #fff;
  line-height: 1;
}
.pin-num {
  font-style: normal;
  transform: rotate(45deg);
  display: inline-block;
}

.marker-list {
  margin: 4px 0 8px;
  border: 1px solid #FDE68A;
  background: #FFFBEB;
  border-radius: 8px;
  padding: 8px;
}
.marker-list-hd {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 13px;
  font-weight: 600;
  margin-bottom: 6px;
}
.marker-row {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 12px;
  margin-bottom: 4px;
  color: #92400E;
}
.dot {
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #ef4444;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.mat-preview-wrap {
  min-height: 160px;
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
  50% { transform: scale(1.08); opacity: 0.85; }
}
</style>
