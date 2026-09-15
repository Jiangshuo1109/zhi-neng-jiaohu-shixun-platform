<template>
  <div class="page-card">
    <h2 class="page-title">我的任务</h2>
    <el-table :data="training.tasks" border>
      <el-table-column prop="name" label="任务名称" min-width="160" />
      <el-table-column prop="lab" label="地点" width="140" />
      <el-table-column prop="teacher" label="教师" width="90" />
      <el-table-column prop="deadline" label="截止" width="150" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag size="small" :type="row.status === '已批阅' ? 'success' : row.status === '进行中' ? 'warning' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="180">
        <template #default="{ row }">
          <el-button link type="primary" @click="$router.push(`/training/tasks/${row.id}`)">进入</el-button>
          <el-button link @click="$router.push(`/training/report/${row.id}`)">报告</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useTrainingStore } from '@/stores/training'
const training = useTrainingStore()
</script>
