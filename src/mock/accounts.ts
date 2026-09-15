export type RoleKey =
  | 'sysadmin'
  | 'labadmin'
  | 'centeradmin'
  | 'teacher'
  | 'student'

export interface Account {
  id: string
  username: string
  password: string
  name: string
  role: RoleKey
  roleLabel: string
  org: string
  phone: string
  email: string
}

export const accounts: Account[] = [
  {
    id: 'u1',
    username: 'sysadmin',
    password: '123456',
    name: '张明',
    role: 'sysadmin',
    roleLabel: '系统管理员',
    org: '信息中心',
    phone: '13800001001',
    email: 'sysadmin@edu.cn',
  },
  {
    id: 'u2',
    username: 'labadmin',
    password: '123456',
    name: '李建国',
    role: 'labadmin',
    roleLabel: '实训室管理员',
    org: '机电工程学院',
    phone: '13800001002',
    email: 'labadmin@edu.cn',
  },
  {
    id: 'u3',
    username: 'centeradmin',
    password: '123456',
    name: '王晓华',
    role: 'centeradmin',
    roleLabel: '中心管理员',
    org: '实训中心',
    phone: '13800001003',
    email: 'centeradmin@edu.cn',
  },
  {
    id: 'u4',
    username: 'teacher',
    password: '123456',
    name: '赵文博',
    role: 'teacher',
    roleLabel: '教师',
    org: '机电工程学院 / 数控技术',
    phone: '13800001004',
    email: 'teacher@edu.cn',
  },
  {
    id: 'u5',
    username: 'student',
    password: '123456',
    name: '陈思远',
    role: 'student',
    roleLabel: '学生',
    org: '机电工程学院 / 数控2301',
    phone: '13800001005',
    email: 'student@edu.cn',
  },
]

export const roleMenus: Record<RoleKey, string[]> = {
  sysadmin: ['workbench', 'base', 'training', 'booking', 'me'],
  labadmin: ['workbench', 'base', 'training', 'booking', 'me'],
  centeradmin: ['workbench', 'base', 'training', 'booking', 'me'],
  teacher: ['workbench', 'training', 'booking', 'me'],
  student: ['workbench', 'training', 'booking', 'me'],
}

export const baseSubMenus: Record<RoleKey, string[]> = {
  sysadmin: ['org', 'users', 'roles', 'logs', 'calendar', 'messages', 'labs', 'apps'],
  labadmin: ['org', 'users', 'calendar', 'messages', 'labs'],
  centeradmin: ['org', 'users', 'calendar', 'messages', 'labs'],
  teacher: [],
  student: [],
}
