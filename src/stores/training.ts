import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  studentTasks as seedTasks,
  onlineStudents as seedOnline,
  historySessions,
  reportTemplates as seedTemplates,
  contactGroups,
  teachingShares as seedShares,
  aiScoreBuiltin,
  PLACEHOLDER,
  type StudentTask,
  type ReportTemplate,
  type TeachingShare,
  type TemplateField,
  type TaskStep,
  type TaskMaterial,
  type HelpRequest,
} from '@/mock/training'

function clone<T>(v: T): T {
  return JSON.parse(JSON.stringify(v)) as T
}

export type CollabTool = 'none' | 'freeze' | 'laser' | 'capture' | 'whiteboard' | 'share'
export type VoiceState = 'idle' | 'ringing' | 'connected' | 'muted'

export interface FreezeMarker {
  id: string
  x: number
  y: number
  note: string
}

export const useTrainingStore = defineStore('training', () => {
  const tasks = ref<StudentTask[]>(clone(seedTasks))
  const online = ref(clone(seedOnline))
  const templates = ref<ReportTemplate[]>(clone(seedTemplates))
  const shares = ref<TeachingShare[]>(clone(seedShares))
  const groups = ref(clone(contactGroups))
  const histories = ref(clone(historySessions))
  const helpRequests = ref<HelpRequest[]>([])

  const sessionStudentId = ref<string | null>('os1')
  const voice = ref<VoiceState>('idle')
  const allMuted = ref(false)
  const activeTool = ref<CollabTool>('none')
  const annotations = ref<string[]>([])
  const captures = ref<string[]>([])
  const helpActive = ref(false)
  const freezeMarkers = ref<FreezeMarker[]>([])
  const freezeOn = ref(false)

  const pendingHelps = computed(() => helpRequests.value.filter((h) => h.status === '待接通'))

  function selectStudent(id: string) {
    sessionStudentId.value = id
    voice.value = 'idle'
    activeTool.value = 'none'
    freezeOn.value = false
    freezeMarkers.value = []
  }

  function startHelp(taskId: string) {
    helpActive.value = true
    const task = tasks.value.find((t) => t.id === taskId)
    const s = online.value.find((o) => o.name === '陈思远') || online.value[0]
    if (s) {
      s.status = '求助中'
      s.lastActive = '刚刚'
    }
    const exists = helpRequests.value.find(
      (h) => h.studentId === s?.id && h.status === '待接通',
    )
    if (!exists && s) {
      helpRequests.value.unshift({
        id: `help${Date.now()}`,
        studentId: s.id,
        studentName: s.name,
        taskId: taskId,
        taskName: task?.name || '实训任务',
        time: new Date().toLocaleString('zh-CN', { hour12: false }),
        status: '待接通',
      })
    }
  }

  function endHelp() {
    helpActive.value = false
    const s = online.value.find((o) => o.status === '求助中')
    if (s) s.status = '作业中'
    helpRequests.value.forEach((h) => {
      if (h.status === '待接通' || h.status === '已接通') h.status = '已结束'
    })
  }

  /** 教师一键接通求助 */
  function acceptHelp(helpId: string) {
    const h = helpRequests.value.find((x) => x.id === helpId)
    if (!h) return
    h.status = '已接通'
    sessionStudentId.value = h.studentId
    voice.value = 'connected'
    freezeOn.value = false
    freezeMarkers.value = []
    activeTool.value = 'none'
    helpActive.value = true
    const s = online.value.find((o) => o.id === h.studentId)
    if (s) s.status = '求助中'
  }

  function toggleVoice() {
    if (voice.value === 'idle') voice.value = 'ringing'
    else if (voice.value === 'ringing') voice.value = 'connected'
    else if (voice.value === 'connected') voice.value = 'muted'
    else voice.value = 'connected'
  }

  function hangup() {
    voice.value = 'idle'
  }

  function setTool(tool: CollabTool) {
    if (tool === 'freeze') {
      freezeOn.value = !freezeOn.value
      activeTool.value = freezeOn.value ? 'freeze' : 'none'
      if (freezeOn.value) {
        annotations.value.unshift(`冻屏开启 ${new Date().toLocaleTimeString()}`)
      } else {
        freezeMarkers.value = []
        annotations.value.unshift(`冻屏关闭 ${new Date().toLocaleTimeString()}`)
      }
      return
    }
    activeTool.value = activeTool.value === tool ? 'none' : tool
    if (tool === 'capture') {
      captures.value.unshift(`抓图 ${new Date().toLocaleTimeString()}`)
    }
    if (tool === 'laser') {
      annotations.value.unshift(`激光笔标注 ${new Date().toLocaleTimeString()}`)
    }
    if (tool === 'whiteboard') {
      annotations.value.unshift(`画板笔迹 ${new Date().toLocaleTimeString()}`)
    }
    if (tool === 'share') {
      annotations.value.unshift(
        activeTool.value === 'share'
          ? `屏幕共享开启 ${new Date().toLocaleTimeString()}`
          : `屏幕共享关闭 ${new Date().toLocaleTimeString()}`,
      )
    }
  }

  function addFreezeMarker(x: number, y: number) {
    if (!freezeOn.value) return
    const m: FreezeMarker = {
      id: `m${Date.now()}`,
      x,
      y,
      note: `标记 ${freezeMarkers.value.length + 1}`,
    }
    freezeMarkers.value.push(m)
    annotations.value.unshift(`冻屏标记点 (${Math.round(x)}%, ${Math.round(y)}%)`)
  }

  function clearFreezeMarkers() {
    freezeMarkers.value = []
  }

  function addPhoto(taskId: string, stepId: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    const step = task?.steps.find((s) => s.id === stepId)
    if (step) step.photos.push(`现场照片-${step.photos.length + 1}`)
  }

  function submitReport(taskId: string, fields: Record<string, string>, content: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (!task) return
    task.reportFields = { ...fields }
    task.reportContent = content
    task.status = '已提交'
    const imgField = Object.values(fields).find((v) => v.startsWith('http') || v.startsWith('data:'))
    if (imgField) task.studentShotUrl = imgField
  }

  function manualScore(taskId: string, score: number) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (!task) return
    task.score = score
    task.status = '已批阅'
  }

  function runAiScore(taskId: string) {
    const task = tasks.value.find((t) => t.id === taskId)
    if (!task) return
    task.aiScore = aiScoreBuiltin.total
    task.aiDetail = aiScoreBuiltin.dimensions.map((d) => `${d.name} ${d.score}`)
    if (!task.studentShotUrl) task.studentShotUrl = aiScoreBuiltin.studentImage
  }

  function addTemplate(name: string, fields: TemplateField[], sections?: string[]) {
    templates.value.unshift({
      id: `rt${Date.now()}`,
      name,
      sections: sections?.length ? sections : fields.map((f) => f.label),
      fields: fields.map((f, i) => ({
        ...f,
        id: f.id || `nf${Date.now()}_${i}`,
      })),
      updatedAt: new Date().toISOString().slice(0, 10),
    })
  }

  function updateTemplate(id: string, name: string, fields: TemplateField[]) {
    const t = templates.value.find((x) => x.id === id)
    if (!t) return
    t.name = name
    t.fields = fields
    t.sections = fields.map((f) => f.label)
    t.updatedAt = new Date().toISOString().slice(0, 10)
  }

  function addShare(type: TeachingShare['type'], title: string) {
    const code = Math.random().toString(36).slice(2, 6).toUpperCase()
    shares.value.unshift({
      id: `ts${Date.now()}`,
      type,
      title,
      link: `https://lab.local/join/${type === '快速' ? 'QK' : type === '预约' ? 'YY' : 'CQ'}-${code}`,
      qrHint: `扫码加入${type}教学`,
      expire: type === '长期' ? '2026-12-31' : '今日 22:00',
    })
  }

  function assignTask(payload: {
    name: string
    lab: string
    className: string
    deadline: string
    teacher?: string
    duration?: number
    steps: TaskStep[]
    reportTemplateId?: string
  }) {
    const tpl =
      templates.value.find((t) => t.id === payload.reportTemplateId) || templates.value[0]
    tasks.value.unshift({
      id: `task${Date.now()}`,
      name: payload.name,
      lab: payload.lab,
      teacher: payload.teacher || '赵文博',
      className: payload.className,
      status: '未开始',
      deadline: payload.deadline,
      reportTemplate: tpl?.name || '标准对刀实验报告',
      reportTemplateId: tpl?.id || 'rt1',
      reportContent: '',
      reportFields: {},
      studentShotUrl: PLACEHOLDER.student,
      steps: payload.steps.length
        ? payload.steps
        : [
            {
              id: 's1',
              title: '准备与安全',
              content: '完成安全确认。',
              materials: [{ type: '图文', name: '安全须知', url: PLACEHOLDER.img1 }],
              photos: [],
            },
          ],
    })
  }

  return {
    tasks,
    online,
    templates,
    shares,
    groups,
    histories,
    helpRequests,
    pendingHelps,
    sessionStudentId,
    voice,
    allMuted,
    activeTool,
    annotations,
    captures,
    helpActive,
    freezeMarkers,
    freezeOn,
    aiScoreBuiltin,
    selectStudent,
    startHelp,
    endHelp,
    acceptHelp,
    toggleVoice,
    hangup,
    setTool,
    addFreezeMarker,
    clearFreezeMarkers,
    addPhoto,
    submitReport,
    manualScore,
    runAiScore,
    addTemplate,
    updateTemplate,
    addShare,
    assignTask,
  }
})

export type { TaskStep, TaskMaterial, TemplateField }
