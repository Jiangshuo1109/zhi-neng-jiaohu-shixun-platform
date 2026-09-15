export interface LabRoom {
  id: string
  name: string
  building: string
  floor: string
  capacity: number
  major: string
  openStatus: '开放' | '关闭' | '维护'
  manager: string
  devices: string
}

export const labs: LabRoom[] = [
  { id: 'lab1', name: '数控车床实训室', building: '机电实训楼', floor: 'A301', capacity: 40, major: '数控技术', openStatus: '开放', manager: '李建国', devices: '数控车床×20' },
  { id: 'lab2', name: '数控铣床实训室', building: '机电实训楼', floor: 'A302', capacity: 36, major: '数控技术', openStatus: '开放', manager: '李建国', devices: '数控铣床×18' },
  { id: 'lab3', name: '机电一体化实训室', building: '机电实训楼', floor: 'B201', capacity: 45, major: '机电一体化', openStatus: '开放', manager: '王晓华', devices: 'PLC 台架×22' },
  { id: 'lab4', name: '工业机器人实训室', building: '机电实训楼', floor: 'B301', capacity: 30, major: '机电一体化', openStatus: '维护', manager: '王晓华', devices: '六轴机器人×8' },
  { id: 'lab5', name: '软件开发实训室', building: '信息楼', floor: 'C401', capacity: 50, major: '软件技术', openStatus: '开放', manager: '张明', devices: '工作站×50' },
  { id: 'lab6', name: '物联网感知实训室', building: '信息楼', floor: 'C402', capacity: 40, major: '物联网应用技术', openStatus: '关闭', manager: '张明', devices: '传感器套件×40' },
]
