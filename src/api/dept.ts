import { ApiClient } from './client';
import type { Department } from '../types/api';

export interface DeptQueryParams {
  name?: string;
  leader?: string;
  phone?: string;
  status?: number;
}

export interface CreateDeptParams {
  name: string;
  parent_id?: number;
  sort?: number;
  leader?: string;
  phone?: string;
  email?: string;
  status: number;
}

/**
 * 获取部门树
 */
export const getDeptTreeApi = (params?: DeptQueryParams) => {
  return ApiClient.get<Department[]>('/v1/sys/depts', { params });
};

/**
 * 获取部门详情
 */
export const getDeptDetailApi = (id: number) => {
  return ApiClient.get<Department>(`/v1/sys/depts/${id}`);
};

/**
 * 创建部门
 */
export const createDeptApi = (data: CreateDeptParams) => {
  return ApiClient.post('/v1/sys/depts', data);
};

/**
 * 更新部门
 */
export const updateDeptApi = (id: number, data: CreateDeptParams) => {
  return ApiClient.put(`/v1/sys/depts/${id}`, data);
};

/**
 * 删除部门
 */
export const deleteDeptApi = (id: number) => {
  return ApiClient.delete(`/v1/sys/depts/${id}`);
};
