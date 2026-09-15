export interface UserRow {
  id: string
  name: string
  username: string
  role: string
  org: string
  status: 'enabled' | 'disabled'
  phone: string
  createdAt: string
}

export const users: UserRow[] = [
  { id: 'usr1', name: '张明', username: 'sysadmin', role: '系统管理员', org: '信息中心', status: 'enabled', phone: '13800001001', createdAt: '2024-09-01' },
  { id: 'usr2', name: '李建国', username: 'labadmin', role: '实训室管理员', org: '机电工程学院', status: 'enabled', phone: '13800001002', createdAt: '2024-09-01' },
  { id: 'usr3', name: '王晓华', username: 'centeradmin', role: '中心管理员', org: '实训中心', status: 'enabled', phone: '13800001003', createdAt: '2024-09-02' },
  { id: 'usr4', name: '赵文博', username: 'teacher', role: '教师', org: '数控技术', status: 'enabled', phone: '13800001004', createdAt: '2024-09-05' },
  { id: 'usr5', name: '钱志强', username: 'qian', role: '教师', org: '机电一体化', status: 'enabled', phone: '13800001006', createdAt: '2024-09-05' },
  { id: 'usr6', name: '孙雅婷', username: 'sun', role: '教师', org: '软件技术', status: 'enabled', phone: '13800001007', createdAt: '2024-09-06' },
  { id: 'usr7', name: '陈思远', username: 'student', role: '学生', org: '数控2301', status: 'enabled', phone: '13800001005', createdAt: '2024-09-10' },
  { id: 'usr8', name: '周梓涵', username: 'zhou', role: '学生', org: '数控2301', status: 'enabled', phone: '13800001008', createdAt: '2024-09-10' },
  { id: 'usr9', name: '吴佳怡', username: 'wu', role: '学生', org: '数控2302', status: 'enabled', phone: '13800001009', createdAt: '2024-09-11' },
  { id: 'usr10', name: '郑浩然', username: 'zheng', role: '学生', org: '机电2301', status: 'disabled', phone: '13800001010', createdAt: '2024-09-12' },
  { id: 'usr11', name: '冯宇航', username: 'feng', role: '学生', org: '软件2301', status: 'enabled', phone: '13800001011', createdAt: '2024-09-12' },
  { id: 'usr12', name: '蒋雨桐', username: 'jiang', role: '学生', org: '物联网2301', status: 'enabled', phone: '13800001012', createdAt: '2024-09-13' },
]
