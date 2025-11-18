// API 通用类型定义

export interface ApiResponse<T = any> {
  code: number;
  data: T;
  msg: string;
}

export interface PageParams {
  page: number;
  size: number;
}

export interface PageResult<T> {
  items: T[];
  total: number;
  page: number;
  size: number;
  pages: number;
}

// 用户相关类型
export interface UserInfo {
  id: number;
  username: string;
  nickname: string;
  avatar?: string;
  email?: string;
  phone?: string;
  dept?: Department;
  roles: Role[];
  status: number;
  is_superuser: boolean;
  is_staff: boolean;
  is_multi_login: boolean;
  join_time: string;
  last_login_time?: string;
}

export interface LoginParams {
  username: string;
  password: string;
  captcha: string;
  uuid: string;
}

export interface LoginResult {
  access_token: string;
  session_uuid: string;
}

export interface CaptchaResult {
  uuid: string;
  image: string;
}

// 部门类型
export interface Department {
  id: number;
  name: string;
  parent_id?: number;
  sort: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: number;
  created_time: string;
  children?: Department[];
}

// 角色类型
export interface Role {
  id: number;
  name: string;
  code: string;
  sort: number;
  status: number;
  data_scope?: number;
  remark?: string;
  created_time: string;
  menus?: Menu[];
}

// 菜单类型
export interface Menu {
  id: number;
  title: string;
  name: string;
  path: string;
  component?: string;
  icon?: string;
  type: number; // 0: 目录, 1: 菜单, 2: 按钮
  sort: number;
  parent_id?: number;
  perms?: string;
  status: number;
  display: number;
  cache: number;
  link?: string;
  remark?: string;
  created_time: string;
  children?: Menu[];
}

// 日志类型
export interface LoginLog {
  id: number;
  username: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
  status: number;
  msg?: string;
  login_time: string;
}

export interface OperationLog {
  id: number;
  username: string;
  method: string;
  title: string;
  ip: string;
  location?: string;
  browser?: string;
  os?: string;
  status: number;
  msg?: string;
  cost_time: number;
  operation_time: string;
}
