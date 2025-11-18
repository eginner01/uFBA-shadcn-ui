import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

export interface DataRule {
  id: number;
  name: string;
  code: string;
  column: string;
  operator: string;
  value?: string;
  remark?: string;
  status: number;
  created_time: string;
  updated_time?: string;
}

export interface DataRuleParams {
  name: string;
  code: string;
  column: string;
  operator: string;
  value?: string;
  remark?: string;
  status?: number;
}

export const getDataRuleListApi = (params: Partial<PageParams>) => {
  return ApiClient.get<PageResult<DataRule>>('/v1/data/rules', { params });
};

export const createDataRuleApi = (data: DataRuleParams) => {
  return ApiClient.post('/v1/data/rules', data);
};

export const updateDataRuleApi = (id: number, data: DataRuleParams) => {
  return ApiClient.put(`/v1/data/rules/${id}`, data);
};

export const deleteDataRuleApi = (id: number) => {
  return ApiClient.delete(`/v1/data/rules/${id}`);
};
