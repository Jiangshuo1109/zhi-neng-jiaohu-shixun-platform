<template>
  <div class="page-card">
    <h2 class="page-title">联系人分组与分组教学</h2>
    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <el-menu :default-active="active" @select="(k: string) => (active = k)">
          <el-menu-item v-for="g in training.groups" :key="g.id" :index="g.id">
            {{ g.name }}（{{ g.members.length }}）
          </el-menu-item>
        </el-menu>
      </el-col>
      <el-col :xs="24" :md="14">
        <div v-if="current">
          <h3 style="margin-top: 0">{{ current.name }}</h3>
          <el-tag v-for="m in current.members" :key="m" style="margin: 0 8px 8px 0">{{ m }}</el-tag>
          <div style="margin-top: 16px">
            <el-button type="primary" @click="startGroup">发起分组教学</el-button>
            <el-button @click="$router.push('/training/collab')">进入协作画面</el-button>
          </div>
          <el-alert
            v-if="started"
            style="margin-top: 12px"
            type="success"
            :closable="false"
            :title="`已向「${current.name}」推送分组教学邀请`"
          />
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'

const training = useTrainingStore()
const active = ref(training.groups[0]?.id || '')
const started = ref(false)
const current = computed(() => training.groups.find((g) => g.id === active.value))

function startGroup() {
  started.value = true
  ElMessage.success('分组教学已开始')
}
</script>
