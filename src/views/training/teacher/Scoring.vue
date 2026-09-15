<template>
  <div>
    <div class="page-card">
      <h2 class="page-title">报告批阅与 AI 评分</h2>
      <el-table :data="submitted" border>
        <el-table-column prop="name" label="任务" min-width="160" />
        <el-table-column prop="className" label="班级" width="110" />
        <el-table-column prop="status" label="状态" width="90" />
        <el-table-column label="人工分" width="80">
          <template #default="{ row }">{{ row.score ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="AI 分" width="80">
          <template #default="{ row }">{{ row.aiScore ?? '-' }}</template>
        </el-table-column>
        <el-table-column label="操作" width="220">
          <template #default="{ row }">
            <el-button link type="primary" @click="open(row.id)">批阅</el-button>
            <el-button link type="success" @click="runAi(row.id)">AI 评分</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <el-dialog v-model="visible" title="人工批阅 / AI 对比评分" width="720px">
      <template v-if="current">
        <p class="muted">任务：{{ current.name }}</p>
        <el-input v-model="current.reportContent" type="textarea" :rows="4" readonly />
        <div class="toolbar" style="margin-top: 12px">
          <span>人工评分</span>
          <el-input-number v-model="manual" :min="0" :max="100" />
          <el-button type="primary" @click="saveManual">提交评分</el-button>
        </div>

        <el-divider />
        <h4 style="margin: 0 0 12px">标准图 vs 学生拍摄图</h4>
        <div class="compare">
          <div class="cmp-card">
            <div class="cmp-label">标准图</div>
            <img :src="training.aiScoreBuiltin.standardImage" alt="标准图" />
          </div>
          <div class="cmp-card">
            <div class="cmp-label">学生拍摄图</div>
            <img :src="current.studentShotUrl || training.aiScoreBuiltin.studentImage" alt="学生拍摄图" />
          </div>
        </div>
        <p class="muted" style="margin-top: 8px">{{ training.aiScoreBuiltin.compareNote }}</p>

        <el-divider />
        <h4 style="margin: 0 0 12px">AI 自动评分（内置对比结果）</h4>
        <div v-if="current.aiScore != null">
          <el-progress :percentage="current.aiScore" :stroke-width="14" style="margin-bottom: 12px" />
          <div v-for="d in training.aiScoreBuiltin.dimensions" :key="d.name" class="dim">
            <div class="dim-head">
              <span>{{ d.name }}</span>
              <strong>{{ d.score }}</strong>
            </div>
            <el-progress :percentage="d.score" :show-text="false" status="success" />
            <p class="muted">{{ d.comment }}</p>
          </div>
          <el-alert :title="training.aiScoreBuiltin.suggestion" type="info" :closable="false" />
        </div>
        <el-button v-else type="success" @click="runAi(current.id)">生成 AI 评分</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'

const training = useTrainingStore()
const visible = ref(false)
const currentId = ref('')
const manual = ref(85)

const submitted = computed(() =>
  training.tasks.filter((t) => t.status === '已提交' || t.status === '已批阅' || t.aiScore),
)

const current = computed(() => training.tasks.find((t) => t.id === currentId.value))

function open(id: string) {
  currentId.value = id
  manual.value = current.value?.score ?? 85
  visible.value = true
}

function runAi(id: string) {
  training.runAiScore(id)
  ElMessage.success('AI 评分已生成（标准图对比结果）')
  currentId.value = id
  visible.value = true
}

function saveManual() {
  if (!current.value) return
  training.manualScore(current.value.id, manual.value)
  ElMessage.success('人工评分已保存')
}
</script>

<style scoped>
.dim {
  margin-bottom: 12px;
}
.dim-head {
  display: flex;
  justify-content: space-between;
  margin-bottom: 4px;
  font-size: 13px;
}
.compare {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
@media (max-width: 640px) {
  .compare {
    grid-template-columns: 1fr;
  }
}
.cmp-card {
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  overflow: hidden;
  background: #F9FAFB;
}
.cmp-label {
  padding: 6px 10px;
  font-size: 13px;
  font-weight: 600;
  background: #EEF2FF;
  color: #1F4B99;
}
.cmp-card img {
  display: block;
  width: 100%;
  height: 180px;
  object-fit: cover;
}
</style>
