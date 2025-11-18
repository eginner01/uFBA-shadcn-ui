import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

export interface DataScope {
  id: number;
  name: string;
  code: string;
  remark?: string;
  status: number;
  created_time: string;
  updated_time?: string;
}

export interface DataScopeParams {
  name: string;
  code: string;
  remark?: string;
  status?: number;
}

export const getDataScopeListApi = (params: Partial<PageParams>) => {
  return ApiClient.get<PageResult<DataScope>>('/v1/data/scopes', { params });
};

export const createDataScopeApi = (data: DataScopeParams) => {
  return ApiClient.post('/v1/data/scopes', data);
};

export const updateDataScopeApi = (id: number, data: DataScopeParams) => {
  return ApiClient.put(`/v1/data/scopes/${id}`, data);
};

export const deleteDataScopeApi = (id: number) => {
  return ApiClient.delete(`/v1/data/scopes/${id}`);
};
