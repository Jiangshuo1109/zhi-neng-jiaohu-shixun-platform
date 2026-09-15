<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">教学类型与分享</h2>
      <el-button type="primary" @click="visible = true">创建分享</el-button>
    </div>
    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="8" v-for="s in training.shares" :key="s.id">
        <el-card shadow="hover" style="margin-bottom: 12px">
          <div class="toolbar" style="margin-bottom: 8px">
            <el-tag>{{ s.type }}</el-tag>
            <span class="muted">到期 {{ s.expire }}</span>
          </div>
          <h3 style="margin: 0 0 8px">{{ s.title }}</h3>
          <p class="link">{{ s.link }}</p>
          <div class="qr">
            <div class="qr-box">QR</div>
            <span class="muted">{{ s.qrHint }}</span>
          </div>
          <el-button size="small" @click="copy(s.link)">复制链接</el-button>
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

function save() {
  if (!form.title) return ElMessage.warning('请填写标题')
  training.addShare(form.type, form.title)
  visible.value = false
  ElMessage.success('已生成分享入口')
}

function copy(link: string) {
  navigator.clipboard?.writeText(link)
  ElMessage.success('链接已复制')
}
</script>

<style scoped>
.link {
  font-size: 12px;
  word-break: break-all;
  color: #1F4B99;
}
.qr {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 12px 0;
}
.qr-box {
  width: 72px;
  height: 72px;
  border: 2px solid #1F4B99;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #1F4B99;
  background: repeating-conic-gradient(#1F4B99 0% 25%, #fff 0% 50%) 50% / 12px 12px;
}
</style>
