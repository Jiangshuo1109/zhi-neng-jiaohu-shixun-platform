export interface LogRow {
  id: string
  type: '操作' | '访问' | '开放接口'
  action: string
  user: string
  ip: string
  time: string
  detail: string
}

export const logs: LogRow[] = [
  { id: 'l1', type: '操作', action: '新增用户', user: '张明', ip: '10.1.2.10', time: '2026-09-14 09:12:03', detail: '创建用户 周梓涵' },
  { id: 'l2', type: '操作', action: '修改开放规则', user: '李建国', ip: '10.1.2.22', time: '2026-09-14 10:05:41', detail: '数控实训室规则组 A' },
  { id: 'l3', type: '访问', action: '登录', user: '赵文博', ip: '10.2.8.55', time: '2026-09-14 08:01:12', detail: 'Web 端登录成功' },
  { id: 'l4', type: '访问', action: '查看预约时间表', user: '陈思远', ip: '10.3.1.18', time: '2026-09-14 11:20:09', detail: '机电实训楼 A301' },
  { id: 'l5', type: '开放接口', action: 'token 校验', user: '教务对接应用', ip: '10.0.0.8', time: '2026-09-14 12:00:01', detail: 'AppKey edu-jw-01' },
  { id: 'l6', type: '操作', action: '预约审核通过', user: '李建国', ip: '10.1.2.22', time: '2026-09-13 16:44:20', detail: '预约单 BK-20260913-003' },
  { id: 'l7', type: '操作', action: '下发实训任务', user: '赵文博', ip: '10.2.8.55', time: '2026-09-13 14:10:00', detail: '数控车床对刀实训' },
  { id: 'l8', type: '访问', action: '打开远程协作', user: '赵文博', ip: '10.2.8.55', time: '2026-09-13 15:02:33', detail: '学生 陈思远' },
  { id: 'l9', type: '开放接口', action: '课表同步', user: '教务对接应用', ip: '10.0.0.8', time: '2026-09-12 23:30:00', detail: '同步 128 条' },
  { id: 'l10', type: '操作', action: '禁用用户', user: '张明', ip: '10.1.2.10', time: '2026-09-12 17:08:51', detail: '郑浩然' },
]
