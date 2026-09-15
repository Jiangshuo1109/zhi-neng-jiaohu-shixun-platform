export interface OrgNode {
  id: string
  name: string
  type: 'college' | 'major' | 'class'
  parentId: string | null
  code: string
  students?: number
}

export const orgs: OrgNode[] = [
  { id: 'c1', name: '机电工程学院', type: 'college', parentId: null, code: 'JD' },
  { id: 'c2', name: '信息工程学院', type: 'college', parentId: null, code: 'XX' },
  { id: 'm1', name: '数控技术', type: 'major', parentId: 'c1', code: 'JD-SK' },
  { id: 'm2', name: '机电一体化', type: 'major', parentId: 'c1', code: 'JD-JD' },
  { id: 'm3', name: '软件技术', type: 'major', parentId: 'c2', code: 'XX-RJ' },
  { id: 'm4', name: '物联网应用技术', type: 'major', parentId: 'c2', code: 'XX-WL' },
  { id: 'cl1', name: '数控2301', type: 'class', parentId: 'm1', code: 'SK2301', students: 42 },
  { id: 'cl2', name: '数控2302', type: 'class', parentId: 'm1', code: 'SK2302', students: 38 },
  { id: 'cl3', name: '机电2301', type: 'class', parentId: 'm2', code: 'JD2301', students: 45 },
  { id: 'cl4', name: '软件2301', type: 'class', parentId: 'm3', code: 'RJ2301', students: 48 },
  { id: 'cl5', name: '物联网2301', type: 'class', parentId: 'm4', code: 'WL2301', students: 40 },
]
