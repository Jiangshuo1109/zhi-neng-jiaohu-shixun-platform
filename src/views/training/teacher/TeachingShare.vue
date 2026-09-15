<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">教学类型与分享</h2>
      <el-button type="primary" @click="visible = true">创建分享</el-button>
    </div>
    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="8" v-for="s in training.shares" :key="s.id">
        <el-card shadow="hover" class="share-card">
          <div class="toolbar" style="margin-bottom: 8px">
            <el-tag :type="s.type === '快速' ? 'success' : s.type === '预约' ? 'warning' : 'info'">{{ s.type }}</el-tag>
            <span class="muted">到期 {{ s.expire }}</span>
          </div>
          <h3 style="margin: 0 0 8px">{{ s.title }}</h3>
          <div class="link-row">
            <el-input :model-value="s.link" readonly>
              <template #append>
                <el-button @click="copy(s.link)">复制</el-button>
              </template>
            </el-input>
          </div>
          <div class="qr">
            <img
              class="qr-img"
              :src="qrUrl(s.link)"
              :alt="`二维码 ${s.title}`"
              width="180"
              height="180"
            />
            <div class="qr-meta">
              <span class="muted">{{ s.qrHint }}</span>
              <el-button size="small" type="primary" plain @click="copy(s.link)">复制分享链接</el-button>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="visible" title="创建教学分享" width="440px">
      <el-form label-width="90px">
        <el-form-item label="教学类型">
          <el-radio-group v-model="form.type">
            <el-radio value="快速">快速</el-radio>
            <el-radio value="预约">预约</el-radio>
            <el-radio value="长期">长期</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="标题"><el-input v-model="form.title" /></el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">生成链接/二维码</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'
import type { TeachingShare } from '@/mock/training'

const training = useTrainingStore()
const visible = ref(false)
const form = reactive<{ type: TeachingShare['type']; title: string }>({ type: '快速', title: '' })

function qrUrl(link: string) {
  return `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(link)}`
}

function save() {
  if (!form.title) return ElMessage.warning('请填写标题')
  training.addShare(form.type, form.title)
  visible.value = false
  ElMessage.success('已生成分享链接与二维码')
}

async function copy(link: string) {
  try {
    await navigator.clipboard?.writeText(link)
    ElMessage.success('分享链接已复制')
  } catch {
    ElMessage.success(`链接：${link}`)
  }
}
</script>

<style scoped>
.share-card {
  margin-bottom: 12px;
}
.link-row {
  margin-bottom: 12px;
}
.qr {
  display: flex;
  align-items: center;
  gap: 16px;
  margin: 8px 0 0;
  flex-wrap: wrap;
}
.qr-img {
  width: 180px;
  height: 180px;
  border: 1px solid #E5E7EB;
  border-radius: 8px;
  background: #fff;
  object-fit: contain;
}
.qr-meta {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
</style>
