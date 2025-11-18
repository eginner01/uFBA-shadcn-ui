import { ApiClient } from './client';
import type { PageParams, PageResult, UserInfo } from '../types/api';

export interface UserQueryParams extends Partial<PageParams> {
  username?: string;
  phone?: string;
  status?: number;
  dept?: number;
}

export interface CreateUserParams {
  username: string;
  password: string;
  nickname?: string;
  phone?: string;
  email?: string;
  dept_id?: number;
  roles: number[];
}

export interface UpdateUserParams {
  username: string;
  nickname?: string;
  phone?: string;
  email?: string;
  avatar?: string;
  dept_id?: number;
  roles: number[];
}

/**
 * 获取用户列表
 */
export const getUserListApi = (params: UserQueryParams) => {
  return ApiClient.get<PageResult<UserInfo>>('/v1/sys/users', { params });
};

/**
 * 创建用户
 */
export const createUserApi = (data: CreateUserParams) => {
  return ApiClient.post('/v1/sys/users', data);
};

/**
 * 更新用户
 */
export const updateUserApi = (id: number, data: UpdateUserParams) => {
  return ApiClient.put(`/v1/sys/users/${id}`, data);
};

/**
 * 删除用户
 */
export const deleteUserApi = (id: number) => {
  return ApiClient.delete(`/v1/sys/users/${id}`);
};

/**
 * 更新用户权限
 */
export const updateUserPermissionApi = (id: number, type: string) => {
  return ApiClient.put(`/v1/sys/users/${id}/permissions`, undefined, {
    params: { type },
  });
};

/**
 * 重置用户密码
 */
export const resetUserPasswordApi = (id: number, password: string) => {
  return ApiClient.put(`/v1/sys/users/${id}/password`, { password });
};
