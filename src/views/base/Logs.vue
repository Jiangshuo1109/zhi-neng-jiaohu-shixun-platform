<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">日志</h2>
      <el-radio-group v-model="type" size="small">
        <el-radio-button value="全部">全部</el-radio-button>
        <el-radio-button value="操作">操作</el-radio-button>
        <el-radio-button value="访问">访问</el-radio-button>
        <el-radio-button value="开放接口">开放接口</el-radio-button>
      </el-radio-group>
    </div>
    <el-table :data="filtered" border stripe>
      <el-table-column prop="time" label="时间" width="160" />
      <el-table-column prop="type" label="类型" width="100" />
      <el-table-column prop="action" label="动作" width="140" />
      <el-table-column prop="user" label="用户" width="110" />
      <el-table-column prop="ip" label="IP" width="120" />
      <el-table-column prop="detail" label="详情" min-width="180" />
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useBaseStore } from '@/stores/base'

const base = useBaseStore()
const type = ref('全部')
const filtered = computed(() =>
  type.value === '全部' ? base.logs : base.logs.filter((l) => l.type === type.value),
)
</script>
