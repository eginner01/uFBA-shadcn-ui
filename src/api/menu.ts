import { ApiClient } from './client';

export interface SidebarMenu {
  id: number;
  title: string;
  path: string;
  icon?: string;
  children?: SidebarMenu[];
}

export interface MenuTreeItem {
  id: number;
  title: string;
  name: string;
  path: string;
  sort: number;
  icon?: string;
  type: number; // 1: 目录, 2: 菜单, 3: 按钮
  component?: string;
  perms?: string;
  status: number;
  display: number;
  cache: number;
  remark?: string;
  parent_id?: number;
  created_time: string;
  children?: MenuTreeItem[];
}

export interface MenuTreeParams {
  title?: string;
  status?: number;
}

export interface MenuParams {
  title: string;
  name: string;
  path?: string;
  parent_id?: number;
  sort?: number;
  icon?: string;
  type?: number;
  component?: string;
  perms?: string;
  status?: number;
  display?: number;
  cache?: number;
  link?: string;
  remark?: string;
}

/**
 * 获取用户侧边栏菜单
 */
export const getUserMenusApi = async (): Promise<SidebarMenu[]> => {
  return ApiClient.get('/v1/sys/menus/sidebar');
};

/**
 * 获取菜单树（管理侧）
 */
export const getMenuTreeApi = async (params?: MenuTreeParams) => {
  return ApiClient.get<MenuTreeItem[]>('/v1/sys/menus', { params });
};

/**
 * 获取菜单详情
 */
export const getMenuByIdApi = async (id: number) => {
  return ApiClient.get(`/v1/sys/menus/${id}`);
};

/**
 * 创建菜单
 */
export const createMenuApi = async (data: MenuParams) => {
  return ApiClient.post('/v1/sys/menus', data);
};

/**
 * 更新菜单
 */
export const updateMenuApi = async (id: number, data: MenuParams) => {
  return ApiClient.put(`/v1/sys/menus/${id}`, data);
};

/**
 * 删除菜单
 */
export const deleteMenuApi = async (id: number) => {
  return ApiClient.delete(`/v1/sys/menus/${id}`);
};
