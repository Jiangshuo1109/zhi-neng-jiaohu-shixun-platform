<template>
  <div class="page-card">
    <h2 class="page-title">历史画面 / 过程记录</h2>
    <el-table :data="training.histories" border>
      <el-table-column prop="student" label="学生" width="100" />
      <el-table-column prop="task" label="任务" min-width="160" />
      <el-table-column prop="start" label="开始时间" width="160" />
      <el-table-column prop="duration" label="时长" width="100" />
      <el-table-column prop="snapshots" label="快照数" width="90" />
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="open(row)">回看</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog v-model="visible" :title="`回看 · ${current?.student}`" width="640px">
      <el-radio-group v-model="mode" style="margin-bottom: 12px">
        <el-radio-button value="关键">关键操作画面</el-radio-button>
        <el-radio-button value="拍照">拍照记录</el-radio-button>
        <el-radio-button value="录屏">录屏记录</el-radio-button>
      </el-radio-group>
      <div class="replay">
        <div class="frame">
          <img v-if="mode !== '录屏'" :src="frameUrl" alt="历史帧" />
          <video v-else :src="videoUrl" controls style="width: 100%; height: 100%; object-fit: cover" />
          <div class="frame-overlay">{{ mode }} · 帧 {{ frame }}/{{ current?.snapshots }}</div>
        </div>
        <el-slider v-model="frame" :min="1" :max="current?.snapshots || 1" />
        <p class="muted">任务：{{ current?.task }} · {{ current?.start }} · {{ current?.duration }}</p>
      </div>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useTrainingStore } from '@/stores/training'
import { PLACEHOLDER, type HistorySession } from '@/mock/training'

const training = useTrainingStore()
const visible = ref(false)
const current = ref<HistorySession | null>(null)
const frame = ref(1)
const mode = ref<'关键' | '拍照' | '录屏'>('关键')
const videoUrl = PLACEHOLDER.video

const frameUrl = computed(() => {
  const seeds = ['hist-a', 'hist-b', 'hist-c', 'hist-d', 'hist-e']
  const seed = seeds[(frame.value - 1) % seeds.length]
  return `https://picsum.photos/seed/${seed}-${mode.value}/640/360`
})

function open(row: HistorySession) {
  current.value = row
  frame.value = 1
  mode.value = '关键'
  visible.value = true
}
</script>

<style scoped>
.replay .frame {
  height: 260px;
  background: #0f172a;
  color: #94a3b8;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 12px;
  overflow: hidden;
  position: relative;
}
.replay .frame img,
.replay .frame video {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.frame-overlay {
  position: absolute;
  left: 10px;
  bottom: 10px;
  background: rgba(0, 0, 0, 0.55);
  color: #fff;
  font-size: 12px;
  padding: 2px 8px;
  border-radius: 4px;
}
</style>
