// Lock screen information
import { logTypeEnum } from '@vben/constants'

export interface LockInfo {
  // Password required
  pwd?: string | undefined
  // Is it locked?
  isLock?: boolean
}
export interface RoleInfo {
  roleName: string
  value: string
}

export interface UserState {
  userInfo: Nullable<UserInfo>
  accessToken?: string
  // roles: RoleInfo[]
  sessionTimeout?: boolean
  lastUpdateTime: number
}

export interface UserInfo {
  // userId: string | number
  name: string
  workcode: string
  account: string
  // avatar: string
  // desc?: string
  role: number
}

export interface BoardInfo {
  access_mode?: string | null
  access_user?: string | null
  add_user?: string | null
  admins?: string | null
  appid: string
  close_project?: number
  collectFlag?: string
  create_time?: string
  eventid: string
  gateway?: string
  id: number
  log_version?: number
  project_desc?: string
  project_name: string
  saas?: string
  sdk_version?: string
  sourcemap_analysis?: number
  ua_flag?: string
  uc_group_id?: number
  itemsData?: any
}

export interface filter {
  start_time: string
  end_time: string
  dimension?: string
  url?: string
  browser?: string
  device?: string
  province?: string
  network?: string
  client?: string
  os?: string
  performance_key?: string
  performance_range?: Array<number>
  resource_type?: string
  api_status?: string
  api_range?: Array<number>
}

export interface filterState {
  start_time?: string
  end_time?: string
  dimension?: string
  url?: string
  browser?: string
  device?: string
  province?: string
  network?: string
  client?: string
  os?: string
  performance_key?: string
  performance_range?: Array<number>
  resource_type?: string
  api_status?: string
  api_range?: Array<number>
}

export interface logInfo {
  type: logTypeEnum
  visible: boolean
  requestParams: object
}

export interface BoardState {
  boardInfoState: BoardInfo
  filterState: filter
  logInfoState: logInfo
  topicIdState: string
  alarmModalVisible: boolean
  latestSDKVersionState: string
  tabState: string
  uaCollapseState?: boolean
}
