import { ApiClient } from './client';

export interface Role {
  id: number;
  name: string;
  key: string;
  status: number;
  sort: number;
  data_scope: number;
  remark?: string;
  created_time: string;
}

export interface RoleParams {
  name: string;
  key: string;
  status: number;
  sort?: number;
  data_scope?: number;
  remark?: string;
}

export async function getRoleListApi(params?: any) {
  return ApiClient.get('/v1/sys/roles', { params });
}

export async function createRoleApi(data: RoleParams) {
  return ApiClient.post('/v1/sys/roles', data);
}

export async function updateRoleApi(id: number, data: RoleParams) {
  return ApiClient.put(`/v1/sys/roles/${id}`, data);
}

export async function deleteRoleApi(id: number) {
  return ApiClient.delete(`/v1/sys/roles/${id}`);
}
