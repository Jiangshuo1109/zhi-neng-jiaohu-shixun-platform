<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">联系人分组与分组教学</h2>
      <el-button type="primary" plain @click="openCreate">新建分组</el-button>
    </div>

    <el-row :gutter="16">
      <el-col :xs="24" :md="10">
        <div class="group-panel">
          <div class="panel-title">选择分组</div>
          <el-menu :default-active="active" @select="onSelect">
            <el-menu-item v-for="g in training.groups" :key="g.id" :index="g.id" class="group-item">
              <span class="g-name">{{ g.name }}</span>
              <el-tag size="small" type="info">{{ g.members.length }} 人</el-tag>
            </el-menu-item>
          </el-menu>
          <el-empty v-if="!training.groups.length" description="暂无分组，请先新建" :image-size="64" />
        </div>
      </el-col>
      <el-col :xs="24" :md="14">
        <div v-if="current" class="detail">
          <div class="detail-hd">
            <h3 style="margin: 0">{{ current.name }}</h3>
            <el-tag type="success" effect="plain">已选中 · {{ current.members.length }} 人</el-tag>
          </div>
          <p class="muted">分组成员</p>
          <div class="members">
            <el-tag v-for="m in current.members" :key="m" type="primary" effect="plain">{{ m }}</el-tag>
          </div>
          <div class="actions">
            <el-button type="primary" size="large" @click="startGroup">开始分组授课</el-button>
            <el-button @click="$router.push('/training/collab')">进入协作画面</el-button>
          </div>
          <el-alert
            v-if="started"
            style="margin-top: 12px"
            type="success"
            show-icon
            :closable="false"
            :title="`分组授课进行中：「${current.name}」共 ${current.members.length} 名成员已收到邀请`"
          />
        </div>
        <el-empty v-else description="请从左侧选择或新建分组" />
      </el-col>
    </el-row>

    <el-dialog v-model="createVisible" title="新建分组" width="420px">
      <el-form label-width="80px">
        <el-form-item label="分组名称">
          <el-input v-model="newName" placeholder="例如：第一组" />
        </el-form-item>
        <el-form-item label="成员">
          <el-select v-model="newMembers" multiple filterable allow-create default-first-option style="width: 100%" placeholder="选择或输入姓名">
            <el-option v-for="s in training.online" :key="s.id" :label="s.name" :value="s.name" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="createVisible = false">取消</el-button>
        <el-button type="primary" @click="createGroup">创建</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { useTrainingStore } from '@/stores/training'

const training = useTrainingStore()
const active = ref(training.groups[0]?.id || '')
const started = ref(false)
const createVisible = ref(false)
const newName = ref('')
const newMembers = ref<string[]>([])
const current = computed(() => training.groups.find((g) => g.id === active.value))

function onSelect(k: string) {
  active.value = k
  started.value = false
  ElMessage.info(`已选中分组「${training.groups.find((g) => g.id === k)?.name || ''}」`)
}

function openCreate() {
  newName.value = ''
  newMembers.value = []
  createVisible.value = true
}

function createGroup() {
  if (!newName.value.trim()) return ElMessage.warning('请填写分组名称')
  if (!newMembers.value.length) return ElMessage.warning('请至少添加一名成员')
  const id = `g${Date.now()}`
  training.groups.push({ id, name: newName.value.trim(), members: [...newMembers.value] })
  active.value = id
  createVisible.value = false
  ElMessage.success(`已创建分组「${newName.value.trim()}」，共 ${newMembers.value.length} 人`)
}

async function startGroup() {
  if (!current.value) return
  try {
    await ElMessageBox.confirm(
      `确认为「${current.value.name}」开始分组授课？将向 ${current.value.members.length} 名成员推送邀请。`,
      '开始分组授课',
      { type: 'warning', confirmButtonText: '开始授课', cancelButtonText: '取消' },
    )
  } catch {
    return
  }
  started.value = true
  ElMessage.success(`分组授课已开始：${current.value.name}（${current.value.members.length} 人）`)
}
</script>

<style scoped>
.group-panel {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  overflow: hidden;
  background: #fff;
}
.panel-title {
  padding: 12px 16px;
  font-weight: 600;
  background: #F3F6FC;
  color: #1F4B99;
  border-bottom: 1px solid #E5E7EB;
}
.group-item {
  display: flex !important;
  justify-content: space-between;
  align-items: center;
}
.g-name {
  flex: 1;
}
.detail {
  border: 1px solid #E5E7EB;
  border-radius: 12px;
  padding: 16px;
  background: #fff;
  min-height: 240px;
}
.detail-hd {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 8px;
}
.members {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-bottom: 16px;
}
.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 8px;
}
</style>
