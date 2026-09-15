export interface MessageRow {
  id: string
  title: string
  content: string
  type: '系统' | '预约' | '实训' | '审核'
  read: boolean
  time: string
  link?: string
}

export const messages: MessageRow[] = [
  { id: 'msg1', title: '预约待审核', content: '赵文博提交了数控实训室预约申请，请及时处理。', type: '审核', read: false, time: '2026-09-14 09:30', link: '/booking/audit' },
  { id: 'msg2', title: '实训任务已下发', content: '您有新的实训任务：数控车床对刀实训。', type: '实训', read: false, time: '2026-09-14 08:15', link: '/training/tasks' },
  { id: 'msg3', title: '预约已通过', content: '您的预约申请 BK-20260912-001 已全部审核通过。', type: '预约', read: true, time: '2026-09-13 17:20', link: '/booking/records' },
  { id: 'msg4', title: '校历更新通知', content: '2025-2026 学年第二学期校历已发布。', type: '系统', read: true, time: '2026-09-12 10:00', link: '/base/calendar' },
  { id: 'msg5', title: '远程求助请求', content: '学生陈思远发起远程求助，请尽快接通。', type: '实训', read: false, time: '2026-09-14 10:42', link: '/training/online' },
  { id: 'msg6', title: '报告待批阅', content: '数控2301 班有 8 份实验报告待批阅。', type: '实训', read: false, time: '2026-09-13 20:05', link: '/training/scoring' },
]
