export interface AuthApp {
  id: string
  name: string
  appKey: string
  appSecret: string
  status: '启用' | '停用'
  createdAt: string
  remark: string
}

export const authApps: AuthApp[] = [
  { id: 'app1', name: '教务系统对接', appKey: 'edu-jw-01', appSecret: 'sk_••••••••a1b2', status: '启用', createdAt: '2025-03-01', remark: '课表与人员同步' },
  { id: 'app2', name: '一卡通门禁', appKey: 'card-door-02', appSecret: 'sk_••••••••c3d4', status: '启用', createdAt: '2025-04-12', remark: '实训室门禁授权' },
  { id: 'app3', name: '移动校园', appKey: 'mobile-camp-03', appSecret: 'sk_••••••••e5f6', status: '启用', createdAt: '2025-06-20', remark: '消息推送通道' },
  { id: 'app4', name: '旧版实验平台', appKey: 'legacy-lab-04', appSecret: 'sk_••••••••g7h8', status: '停用', createdAt: '2024-01-08', remark: '已迁移停用' },
]
