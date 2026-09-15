import { createRouter, createWebHistory, type RouteRecordRaw } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/Login.vue'),
    meta: { public: true },
  },
  {
    path: '/',
    component: () => import('@/layouts/AppShell.vue'),
    redirect: '/workbench',
    children: [
      { path: 'workbench', name: 'workbench', component: () => import('@/views/workbench/Index.vue'), meta: { title: '工作台', menu: 'workbench' } },
      {
        path: 'base',
        name: 'base',
        component: () => import('@/views/base/Index.vue'),
        meta: { title: '基础数据', menu: 'base' },
        redirect: '/base/home',
        children: [
          { path: 'home', name: 'base-home', component: () => import('@/views/base/Home.vue'), meta: { title: '基础数据', menu: 'base' } },
          { path: 'org', name: 'base-org', component: () => import('@/views/base/Org.vue'), meta: { title: '组织管理', menu: 'base' } },
          { path: 'users', name: 'base-users', component: () => import('@/views/base/Users.vue'), meta: { title: '用户管理', menu: 'base' } },
          { path: 'roles', name: 'base-roles', component: () => import('@/views/base/Roles.vue'), meta: { title: '角色权限', menu: 'base' } },
          { path: 'logs', name: 'base-logs', component: () => import('@/views/base/Logs.vue'), meta: { title: '日志', menu: 'base' } },
          { path: 'calendar', name: 'base-calendar', component: () => import('@/views/base/Calendar.vue'), meta: { title: '校历节次', menu: 'base' } },
          { path: 'messages', name: 'base-messages', component: () => import('@/views/base/Messages.vue'), meta: { title: '消息', menu: 'base' } },
          { path: 'labs', name: 'base-labs', component: () => import('@/views/base/Labs.vue'), meta: { title: '实训室用房', menu: 'base' } },
          { path: 'apps', name: 'base-apps', component: () => import('@/views/base/Apps.vue'), meta: { title: '授权应用', menu: 'base' } },
        ],
      },
      {
        path: 'training',
        name: 'training',
        component: () => import('@/views/training/Index.vue'),
        meta: { title: '实体实训', menu: 'training' },
        redirect: '/training/home',
        children: [
          { path: 'home', name: 'training-home', component: () => import('@/views/training/Home.vue'), meta: { title: '实体实训', menu: 'training' } },
          { path: 'tasks', name: 'training-tasks', component: () => import('@/views/training/student/Tasks.vue'), meta: { title: '我的任务', menu: 'training' } },
          { path: 'tasks/:id', name: 'training-task-detail', component: () => import('@/views/training/student/TaskDetail.vue'), meta: { title: '任务详情', menu: 'training' } },
          { path: 'report/:id', name: 'training-report', component: () => import('@/views/training/student/Report.vue'), meta: { title: '实验报告', menu: 'training' } },
          { path: 'online', name: 'training-online', component: () => import('@/views/training/teacher/Online.vue'), meta: { title: '在线学生', menu: 'training' } },
          { path: 'live', name: 'training-live', component: () => import('@/views/training/teacher/LiveView.vue'), meta: { title: '实时画面', menu: 'training' } },
          { path: 'history', name: 'training-history', component: () => import('@/views/training/teacher/History.vue'), meta: { title: '历史回看', menu: 'training' } },
          { path: 'templates', name: 'training-templates', component: () => import('@/views/training/teacher/Templates.vue'), meta: { title: '报告模板', menu: 'training' } },
          { path: 'collab', name: 'training-collab', component: () => import('@/views/training/teacher/RemoteCollab.vue'), meta: { title: '远程协作', menu: 'training' } },
          { path: 'groups', name: 'training-groups', component: () => import('@/views/training/teacher/Groups.vue'), meta: { title: '分组教学', menu: 'training' } },
          { path: 'share', name: 'training-share', component: () => import('@/views/training/teacher/TeachingShare.vue'), meta: { title: '教学分享', menu: 'training' } },
          { path: 'assign', name: 'training-assign', component: () => import('@/views/training/teacher/Assign.vue'), meta: { title: '任务安排', menu: 'training' } },
          { path: 'scoring', name: 'training-scoring', component: () => import('@/views/training/teacher/Scoring.vue'), meta: { title: '批阅评分', menu: 'training' } },
        ],
      },
      {
        path: 'booking',
        name: 'booking',
        component: () => import('@/views/booking/Index.vue'),
        meta: { title: '开放预约', menu: 'booking' },
        redirect: '/booking/home',
        children: [
          { path: 'home', name: 'booking-home', component: () => import('@/views/booking/Home.vue'), meta: { title: '开放预约', menu: 'booking' } },
          { path: 'manage', name: 'booking-manage', component: () => import('@/views/booking/OpenManage.vue'), meta: { title: '开放管理', menu: 'booking' } },
          { path: 'settings', name: 'booking-settings', component: () => import('@/views/booking/OpenSettings.vue'), meta: { title: '开放设置', menu: 'booking' } },
          { path: 'schedule', name: 'booking-schedule', component: () => import('@/views/booking/Schedule.vue'), meta: { title: '预约时间表', menu: 'booking' } },
          { path: 'apply', name: 'booking-apply', component: () => import('@/views/booking/Apply.vue'), meta: { title: '预约申请', menu: 'booking' } },
          { path: 'audit', name: 'booking-audit', component: () => import('@/views/booking/Audit.vue'), meta: { title: '审核中心', menu: 'booking' } },
          { path: 'progress/:id?', name: 'booking-progress', component: () => import('@/views/booking/Progress.vue'), meta: { title: '审核进度', menu: 'booking' } },
          { path: 'records', name: 'booking-records', component: () => import('@/views/booking/Records.vue'), meta: { title: '预约记录', menu: 'booking' } },
        ],
      },
      { path: 'me', name: 'me', component: () => import('@/views/me/Index.vue'), meta: { title: '我的', menu: 'me' } },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!to.meta.public && !auth.isLoggedIn) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }
  if (to.name === 'login' && auth.isLoggedIn) {
    return { path: '/workbench' }
  }
  return true
})

export default router
