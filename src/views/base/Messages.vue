<template>
  <div class="page-card">
    <h2 class="page-title">消息</h2>
    <el-table :data="base.messageList" border>
      <el-table-column prop="time" label="时间" width="150" />
      <el-table-column prop="type" label="类型" width="90" />
      <el-table-column prop="title" label="标题" width="160" />
      <el-table-column prop="content" label="内容" min-width="200" />
      <el-table-column label="状态" width="90">
        <template #default="{ row }">
          <el-tag :type="row.read ? 'info' : 'warning'" size="small">{{ row.read ? '已读' : '未读' }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="120">
        <template #default="{ row }">
          <el-button link type="primary" @click="open(row)">查看</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useBaseStore } from '@/stores/base'
import type { MessageRow } from '@/mock/messages'

const base = useBaseStore()
const router = useRouter()

function open(row: MessageRow) {
  base.markRead(row.id)
  if (row.link) router.push(row.link)
}
</script>
