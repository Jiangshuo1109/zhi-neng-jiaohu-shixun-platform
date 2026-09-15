<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">实时画面</h2>
      <el-select :model-value="training.sessionStudentId" style="width: 160px" @change="training.selectStudent">
        <el-option v-for="s in training.online" :key="s.id" :label="s.name" :value="s.id" />
      </el-select>
      <el-button type="primary" @click="$router.push('/training/collab')">进入远程协作</el-button>
    </div>
    <div class="live-grid">
      <div class="screen">
        <div class="badge">LIVE · {{ current?.name }} · {{ current?.device }}</div>
        <div class="live-feed">工位实时画面</div>
        <div class="hud">分辨率 1280×720 · 延迟 86ms · {{ training.allMuted ? '全员静音' : '声音开' }}</div>
      </div>
      <div class="side">
        <h4>状态</h4>
        <p>学生：{{ current?.name }}</p>
        <p>班级：{{ current?.className }}</p>
        <p>状态：{{ current?.status }}</p>
        <el-button style="width: 100%; margin-top: 8px" @click="$router.push('/training/history')">历史回看</el-button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useTrainingStore } from '@/stores/training'

const training = useTrainingStore()
const current = computed(() => training.online.find((s) => s.id === training.sessionStudentId))
</script>

<style scoped>
.live-grid {
  display: grid;
  grid-template-columns: 1fr 220px;
  gap: 12px;
}
@media (max-width: 800px) {
  .live-grid {
    grid-template-columns: 1fr;
  }
}
.screen {
  position: relative;
  background: #0f172a;
  border-radius: 12px;
  min-height: 320px;
  overflow: hidden;
  color: #fff;
}
.live-feed {
  height: 320px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: repeating-linear-gradient(45deg, #1e293b, #1e293b 12px, #0f172a 12px, #0f172a 24px);
  color: #94a3b8;
}
.badge {
  position: absolute;
  top: 12px;
  left: 12px;
  background: #B91C1C;
  padding: 2px 8px;
  border-radius: 999px;
  font-size: 12px;
}
.hud {
  position: absolute;
  bottom: 10px;
  left: 12px;
  right: 12px;
  font-size: 12px;
  color: #cbd5e1;
}
.side {
  background: #F9FAFB;
  border-radius: 12px;
  padding: 12px;
  border: 1px solid #E5E7EB;
}
</style>
