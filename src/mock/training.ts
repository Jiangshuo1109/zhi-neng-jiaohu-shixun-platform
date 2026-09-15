export type MaterialType = '图文' | '视频' | '文档'

export interface TaskMaterial {
  type: MaterialType
  name: string
  url: string
  /** 预览用正文（文档类） */
  content?: string
}

export interface TaskStep {
  id: string
  title: string
  content: string
  materials: TaskMaterial[]
  photos: string[]
}

export type FieldType = '文本填空' | '图片上传'

export interface TemplateField {
  id: string
  label: string
  type: FieldType
  required?: boolean
}

export interface StudentTask {
  id: string
  name: string
  lab: string
  teacher: string
  className: string
  status: '未开始' | '进行中' | '已提交' | '已批阅'
  deadline: string
  steps: TaskStep[]
  reportTemplate: string
  reportTemplateId: string
  reportContent: string
  /** 按字段填写的报告值 */
  reportFields: Record<string, string>
  score?: number
  aiScore?: number
  aiDetail?: string[]
  /** 学生拍摄图（AI 对比用） */
  studentShotUrl?: string
}

export interface OnlineStudent {
  id: string
  name: string
  className: string
  status: '在线' | '求助中' | '离线' | '作业中'
  device: string
  lastActive: string
}

export interface HelpRequest {
  id: string
  studentId: string
  studentName: string
  taskId: string
  taskName: string
  time: string
  status: '待接通' | '已接通' | '已结束'
}

export interface HistorySession {
  id: string
  student: string
  task: string
  start: string
  duration: string
  snapshots: number
}

export interface ReportTemplate {
  id: string
  name: string
  sections: string[]
  fields: TemplateField[]
  updatedAt: string
}

export interface ContactGroup {
  id: string
  name: string
  members: string[]
}

export interface TeachingShare {
  id: string
  type: '快速' | '预约' | '长期'
  title: string
  link: string
  qrHint: string
  expire: string
}

/** 占位图 / 视频（公开可访问） */
export const PLACEHOLDER = {
  img1: 'https://picsum.photos/seed/tooling1/640/400',
  img2: 'https://picsum.photos/seed/tooling2/640/400',
  img3: 'https://picsum.photos/seed/clamp/640/400',
  img4: 'https://picsum.photos/seed/circuit/640/400',
  img5: 'https://picsum.photos/seed/robot/640/400',
  standard: 'https://picsum.photos/seed/standard-cut/640/400',
  student: 'https://picsum.photos/seed/student-cut/640/400',
  video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4',
}

export const studentTasks: StudentTask[] = [
  {
    id: 'task1',
    name: '数控车床对刀实训',
    lab: '数控车床实训室',
    teacher: '赵文博',
    className: '数控2301',
    status: '进行中',
    deadline: '2026-09-20 18:00',
    reportTemplate: '标准对刀实验报告',
    reportTemplateId: 'rt1',
    reportContent: '',
    reportFields: {},
    studentShotUrl: PLACEHOLDER.student,
    steps: [
      {
        id: 's1',
        title: '安全确认与开机',
        content: '检查急停、防护罩与润滑状态，按开机流程上电。',
        materials: [
          { type: '图文', name: '开机检查清单', url: PLACEHOLDER.img1 },
          { type: '视频', name: '安全操作 3 分钟', url: PLACEHOLDER.video },
        ],
        photos: [],
      },
      {
        id: 's2',
        title: '装夹工件与刀具',
        content: '正确装夹棒料，选择外圆车刀并确认刀尖高度。',
        materials: [
          { type: '图文', name: '装夹示意图', url: PLACEHOLDER.img3 },
          {
            type: '文档',
            name: '刀具参数表.pdf',
            url: '#',
            content:
              '刀具型号：外圆车刀 YT15\n刀尖半径：0.4 mm\n推荐转速：800–1200 r/min\n进给量：0.1–0.2 mm/r\n切深：≤1.5 mm\n注意事项：装夹后需确认刀尖与主轴中心等高。',
          },
        ],
        photos: [],
      },
      {
        id: 's3',
        title: '试切对刀',
        content: '分别完成 X/Z 向试切，记录机械坐标并设置工件坐标系。',
        materials: [
          { type: '视频', name: '试切对刀示范', url: PLACEHOLDER.video },
          { type: '图文', name: '坐标系设置步骤', url: PLACEHOLDER.img2 },
        ],
        photos: [],
      },
      {
        id: 's4',
        title: '验证与收尾',
        content: '运行验证程序，测量尺寸并清理现场。',
        materials: [
          {
            type: '文档',
            name: '验收标准.docx',
            url: '#',
            content:
              '验收项目：\n1. 外圆尺寸偏差 ≤ ±0.05 mm\n2. 端面跳动 ≤ 0.03 mm\n3. 坐标系设置正确且可复现\n4. 现场清理与刀具归位完成',
          },
        ],
        photos: [],
      },
    ],
  },
  {
    id: 'task2',
    name: 'PLC 电机正反转控制',
    lab: '机电一体化实训室',
    teacher: '钱志强',
    className: '数控2301',
    status: '未开始',
    deadline: '2026-09-25 18:00',
    reportTemplate: 'PLC 实验报告模板',
    reportTemplateId: 'rt2',
    reportContent: '',
    reportFields: {},
    studentShotUrl: PLACEHOLDER.img4,
    steps: [
      {
        id: 's1',
        title: '识读电路图',
        content: '理解主电路与控制电路，标注输入输出点。',
        materials: [{ type: '图文', name: '电路图', url: PLACEHOLDER.img4 }],
        photos: [],
      },
      {
        id: 's2',
        title: '接线与程序编写',
        content: '按图接线并编写梯形图程序。',
        materials: [{ type: '视频', name: '接线示范', url: PLACEHOLDER.video }],
        photos: [],
      },
    ],
  },
  {
    id: 'task3',
    name: '工业机器人轨迹示教',
    lab: '工业机器人实训室',
    teacher: '赵文博',
    className: '数控2301',
    status: '已提交',
    deadline: '2026-09-10 18:00',
    reportTemplate: '机器人示教报告',
    reportTemplateId: 'rt3',
    reportContent: '已完成示教点记录与轨迹复现验证。',
    reportFields: {
      f1: '完成示教点 P1–P5 记录与轨迹复现验证。',
      f2: '坐标系与工具坐标确认无误，安全围栏已就位。',
      f3: PLACEHOLDER.img5,
    },
    score: 86,
    aiScore: 88,
    aiDetail: ['步骤完整度 90', '安全规范 85', '报告规范性 88', '数据准确性 89'],
    studentShotUrl: PLACEHOLDER.img5,
    steps: [
      {
        id: 's1',
        title: '示教准备',
        content: '确认坐标系与工具坐标。',
        materials: [{ type: '图文', name: '准备清单', url: PLACEHOLDER.img5 }],
        photos: ['photo-1'],
      },
    ],
  },
]

export const onlineStudents: OnlineStudent[] = [
  { id: 'os1', name: '陈思远', className: '数控2301', status: '作业中', device: '工位 03 / AR 眼镜', lastActive: '刚刚' },
  { id: 'os2', name: '周梓涵', className: '数控2301', status: '作业中', device: '工位 05', lastActive: '1 分钟前' },
  { id: 'os3', name: '吴佳怡', className: '数控2302', status: '在线', device: '工位 12', lastActive: '3 分钟前' },
  { id: 'os4', name: '冯宇航', className: '软件2301', status: '在线', device: '工位 08', lastActive: '5 分钟前' },
  { id: 'os5', name: '蒋雨桐', className: '物联网2301', status: '离线', device: '工位 02', lastActive: '40 分钟前' },
  { id: 'os6', name: '沈俊杰', className: '数控2301', status: '作业中', device: '工位 07', lastActive: '2 分钟前' },
]

export const historySessions: HistorySession[] = [
  { id: 'hs1', student: '陈思远', task: '数控车床对刀实训', start: '2026-09-13 14:00', duration: '46 分钟', snapshots: 12 },
  { id: 'hs2', student: '周梓涵', task: '数控车床对刀实训', start: '2026-09-13 14:05', duration: '52 分钟', snapshots: 9 },
  { id: 'hs3', student: '吴佳怡', task: 'PLC 电机正反转控制', start: '2026-09-12 09:10', duration: '68 分钟', snapshots: 15 },
  { id: 'hs4', student: '陈思远', task: '工业机器人轨迹示教', start: '2026-09-09 15:20', duration: '55 分钟', snapshots: 20 },
]

export const reportTemplates: ReportTemplate[] = [
  {
    id: 'rt1',
    name: '标准对刀实验报告',
    sections: ['实验目的', '设备与工具', '操作步骤', '数据记录', '问题与分析', '结论'],
    fields: [
      { id: 'f1', label: '实验目的', type: '文本填空', required: true },
      { id: 'f2', label: '操作步骤简述', type: '文本填空', required: true },
      { id: 'f3', label: '试切对刀现场照片', type: '图片上传', required: true },
      { id: 'f4', label: '数据记录与结论', type: '文本填空' },
      { id: 'f5', label: '问题分析附图', type: '图片上传' },
    ],
    updatedAt: '2026-08-20',
  },
  {
    id: 'rt2',
    name: 'PLC 实验报告模板',
    sections: ['实验目的', 'I/O 分配', '梯形图', '调试记录', '总结'],
    fields: [
      { id: 'f1', label: '实验目的', type: '文本填空', required: true },
      { id: 'f2', label: 'I/O 分配说明', type: '文本填空', required: true },
      { id: 'f3', label: '接线实物照片', type: '图片上传', required: true },
      { id: 'f4', label: '调试记录', type: '文本填空' },
    ],
    updatedAt: '2026-08-22',
  },
  {
    id: 'rt3',
    name: '机器人示教报告',
    sections: ['任务描述', '示教点表', '轨迹复现', '安全记录', '心得'],
    fields: [
      { id: 'f1', label: '任务描述', type: '文本填空', required: true },
      { id: 'f2', label: '安全确认记录', type: '文本填空', required: true },
      { id: 'f3', label: '轨迹复现截图', type: '图片上传', required: true },
    ],
    updatedAt: '2026-09-01',
  },
]

export const contactGroups: ContactGroup[] = [
  { id: 'g1', name: '数控2301 全班', members: ['陈思远', '周梓涵', '沈俊杰', '何晓燕', '吕梦琪'] },
  { id: 'g2', name: '竞赛集训组', members: ['陈思远', '吴佳怡', '蒋雨桐'] },
  { id: 'g3', name: '补做学生组', members: ['郑浩然', '周梓涵'] },
]

export const teachingShares: TeachingShare[] = [
  { id: 'ts1', type: '快速', title: '今日对刀指导', link: 'https://lab.local/join/QK-8821', qrHint: '扫码加入快速指导', expire: '今日 22:00' },
  { id: 'ts2', type: '预约', title: '周四晚答疑', link: 'https://lab.local/join/YY-3390', qrHint: '扫码预约答疑时段', expire: '2026-09-18 21:00' },
  { id: 'ts3', type: '长期', title: '数控课程常驻教室', link: 'https://lab.local/join/CQ-1102', qrHint: '学期有效长期入口', expire: '2026-12-31' },
]

export const aiScoreBuiltin = {
  total: 87,
  dimensions: [
    { name: '步骤完整度', score: 90, comment: '四步均有记录，第三步照片清晰' },
    { name: '安全规范', score: 84, comment: '防护确认完整，收尾清理描述略简' },
    { name: '数据准确性', score: 88, comment: '试切坐标与实测误差在允许范围' },
    { name: '报告规范性', score: 86, comment: '结构完整，结论可再提炼要点' },
  ],
  suggestion: '建议补充刀具磨损观察与一次复测数据。',
  standardImage: PLACEHOLDER.standard,
  studentImage: PLACEHOLDER.student,
  compareNote: '标准图与学生拍摄图在刀尖位置、试切痕迹上基本一致，存在轻微角度偏差。',
}
