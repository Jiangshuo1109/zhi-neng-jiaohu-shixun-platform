<template>
  <div class="page-card">
    <div class="toolbar">
      <h2 class="page-title" style="margin: 0; flex: 1">报告模板配置</h2>
      <el-button type="primary" @click="openCreate">新建模板</el-button>
    </div>
    <el-row :gutter="12">
      <el-col :xs="24" :sm="12" :md="8" v-for="t in training.templates" :key="t.id">
        <el-card shadow="hover" style="margin-bottom: 12px">
          <div class="toolbar" style="margin-bottom: 8px">
            <h3 style="margin: 0; flex: 1">{{ t.name }}</h3>
            <el-button link type="primary" @click="openEdit(t)">编辑字段</el-button>
          </div>
          <div v-for="f in t.fields" :key="f.id" class="field-row">
            <el-tag size="small" :type="f.type === '图片上传' ? 'warning' : ''">{{ f.type }}</el-tag>
            <span>{{ f.label }}</span>
            <el-tag v-if="f.required" size="small" type="danger" effect="plain">必填</el-tag>
          </div>
          <p class="muted">更新于 {{ t.updatedAt }} · 共 {{ t.fields.length }} 个字段</p>
        </el-card>
      </el-col>
    </el-row>

    <el-dialog v-model="visible" :title="editingId ? '编辑报告模板' : '新建报告模板'" width="640px">
      <el-form label-width="80px">
        <el-form-item label="名称"><el-input v-model="form.name" placeholder="模板名称" /></el-form-item>
        <el-form-item label="字段">
          <div class="fields-editor">
            <div v-for="(f, idx) in form.fields" :key="idx" class="field-edit">
              <el-input v-model="f.label" placeholder="字段名称" style="flex: 1" />
              <el-select v-model="f.type" style="width: 130px">
                <el-option label="文本填空" value="文本填空" />
                <el-option label="图片上传" value="图片上传" />
              </el-select>
              <el-checkbox v-model="f.required">必填</el-checkbox>
              <el-button link type="danger" @click="form.fields.splice(idx, 1)">删除</el-button>
            </div>
            <el-button @click="addField">添加字段</el-button>
          </div>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="visible = false">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { useTrainingStore } from '@/stores/training'
import type { ReportTemplate, TemplateField } from '@/mock/training'

const training = useTrainingStore()
const visible = ref(false)
const editingId = ref<string | null>(null)
const form = reactive<{ name: string; fields: TemplateField[] }>({
  name: '',
  fields: [],
})

function blankField(): TemplateField {
  return { id: `f${Date.now()}_${Math.random().toString(36).slice(2, 5)}`, label: '', type: '文本填空', required: false }
}

function openCreate() {
  editingId.value = null
  form.name = ''
  form.fields = [
    { id: 'nf1', label: '实验目的', type: '文本填空', required: true },
    { id: 'nf2', label: '现场操作照片', type: '图片上传', required: true },
  ]
  visible.value = true
}

function openEdit(t: ReportTemplate) {
  editingId.value = t.id
  form.name = t.name
  form.fields = t.fields.map((f) => ({ ...f }))
  visible.value = true
}

function addField() {
  form.fields.push(blankField())
}

function save() {
  if (!form.name) return ElMessage.warning('请填写名称')
  if (!form.fields.length) return ElMessage.warning('请至少添加一个字段')
  if (form.fields.some((f) => !f.label)) return ElMessage.warning('字段名称不能为空')
  const hasText = form.fields.some((f) => f.type === '文本填空')
  const hasImg = form.fields.some((f) => f.type === '图片上传')
  if (!hasText || !hasImg) return ElMessage.warning('模板需同时包含「文本填空」与「图片上传」字段')
  if (editingId.value) {
    training.updateTemplate(editingId.value, form.name, form.fields)
  } else {
    training.addTemplate(form.name, form.fields)
  }
  visible.value = false
  ElMessage.success('模板已保存')
}
</script>

<style scoped>
.field-row {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
  font-size: 13px;
}
.fields-editor {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;
}
.field-edit {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  align-items: center;
}
</style>
