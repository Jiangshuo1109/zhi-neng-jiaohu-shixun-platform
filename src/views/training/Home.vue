<template>
  <div>
    <h2 class="page-title">实体实训</h2>
    <div class="grid-cards">
      <div class="page-card card" v-for="c in cards" :key="c.to" @click="$router.push(c.to)">
        <h3>{{ c.title }}</h3>
        <p class="muted">{{ c.desc }}</p>
        <el-tag v-if="c.tag" size="small" type="warning">{{ c.tag }}</el-tag>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()

const cards = computed(() => {
  if (auth.role === 'student') {
    return [
      { title: '我的任务', desc: '步骤资料、拍照关联、远程求助', to: '/training/tasks' },
      { title: '实验报告', desc: '提交与课后修改', to: '/training/tasks' },
    ]
  }
  return [
    { title: '在线学生', desc: '状态列表与一键进入协作', to: '/training/online', tag: '#' },
    { title: '实时画面', desc: '工位画面总览', to: '/training/live' },
    { title: '远程协作', desc: '双向语音、冻屏、激光笔、共享', to: '/training/collab', tag: '▲/#' },
    { title: '历史回看', desc: '过程记录与画面快照', to: '/training/history', tag: '▲' },
    { title: '报告模板', desc: '实验报告模板配置', to: '/training/templates', tag: '▲' },
    { title: '分组教学', desc: '联系人分组与分组授课', to: '/training/groups', tag: '#' },
    { title: '教学分享', desc: '快速/预约/长期 + 链接二维码', to: '/training/share', tag: '#' },
    { title: '任务安排', desc: '地点/时长/班级下发', to: '/training/assign' },
    { title: '批阅评分', desc: '人工批阅 + AI 自动评分', to: '/training/scoring', tag: '▲' },
    { title: '我的任务', desc: '查看已下发任务与报告', to: '/training/tasks' },
  ]
})
</script>

<style scoped>
.card {
  cursor: pointer;
}
.card h3 {
  margin: 0 0 6px;
  color: #1f4b99;
}
</style>
