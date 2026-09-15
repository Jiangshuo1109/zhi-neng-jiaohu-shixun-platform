<template>
  <div>
    <div class="page-card">
      <h2 class="page-title">校历</h2>
      <el-table :data="base.terms" border>
        <el-table-column prop="name" label="学期" min-width="200" />
        <el-table-column prop="start" label="开学" width="120" />
        <el-table-column prop="end" label="结束" width="120" />
        <el-table-column prop="weeks" label="周数" width="80" />
      </el-table>
    </div>
    <div class="page-card" style="margin-top: 16px">
      <h2 class="page-title">课程节次</h2>
      <el-table :data="base.periods" border>
        <el-table-column prop="name" label="节次" width="100" />
        <el-table-column prop="start" label="开始" width="100" />
        <el-table-column prop="end" label="结束" width="100" />
      </el-table>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useBaseStore } from '@/stores/base'
const base = useBaseStore()
</script>
