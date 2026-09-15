export interface Permission {
  key: string
  label: string
}

export interface RoleDef {
  id: string
  name: string
  code: string
  permissions: string[]
  userCount: number
}

export const allPermissions: Permission[] = [
  { key: 'base.org', label: '组织管理' },
  { key: 'base.users', label: '用户管理' },
  { key: 'base.roles', label: '角色权限' },
  { key: 'base.logs', label: '日志查询' },
  { key: 'base.calendar', label: '校历节次' },
  { key: 'base.messages', label: '消息管理' },
  { key: 'base.labs', label: '实训室用房' },
  { key: 'base.apps', label: '授权应用' },
  { key: 'booking.open', label: '开放设置' },
  { key: 'booking.apply', label: '预约申请' },
  { key: 'booking.audit1', label: '一级审核' },
  { key: 'booking.audit2', label: '二级审核' },
  { key: 'training.task', label: '任务执行' },
  { key: 'training.supervise', label: '实训监管' },
  { key: 'training.collab', label: '远程协作' },
  { key: 'training.score', label: '报告批阅' },
]

export const roles: RoleDef[] = [
  {
    id: 'r1',
    name: '系统管理员',
    code: 'sysadmin',
    permissions: allPermissions.map((p) => p.key),
    userCount: 1,
  },
  {
    id: 'r2',
    name: '实训室管理员',
    code: 'labadmin',
    permissions: ['base.org', 'base.users', 'base.calendar', 'base.messages', 'base.labs', 'booking.open', 'booking.audit1', 'training.supervise'],
    userCount: 2,
  },
  {
    id: 'r3',
    name: '中心管理员',
    code: 'centeradmin',
    permissions: ['base.org', 'base.users', 'base.calendar', 'base.messages', 'base.labs', 'booking.audit2', 'training.supervise'],
    userCount: 1,
  },
  {
    id: 'r4',
    name: '教师',
    code: 'teacher',
    permissions: ['booking.apply', 'training.supervise', 'training.collab', 'training.score'],
    userCount: 12,
  },
  {
    id: 'r5',
    name: '学生',
    code: 'student',
    permissions: ['booking.apply', 'training.task'],
    userCount: 860,
  },
]
