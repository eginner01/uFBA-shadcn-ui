import { ApiClient } from './client';

export interface DataScopeResult {
  id: number;
  name: string;
  status: number;
  created_time: string;
  updated_time: string;
}

export interface DataRuleResult {
  id: number;
  name: string;
  model: string;
  column: string;
  operator: string;
  expression: string;
  value: string;
  created_time: string;
  updated_time: string;
}

export interface DataScopeParams {
  name?: string;
  status?: number;
  page?: number;
  size?: number;
}

export interface CreateDataScopeParams {
  name: string;
  status: number;
}

export interface DataScopeRulesResult extends DataScopeResult {
  rules: DataRuleResult[];
}

export interface DataRuleParams {
  name?: string;
  page?: number;
  size?: number;
}

export interface DataRuleModelColumnsResult {
  key: string;
  comment: string;
}

export interface CreateDataRuleParams {
  name: string;
  model: string;
  column: string;
  operator: string;
  expression: string;
  value: string;
}

// 数据范围 API
export const getDataScopeListApi = async (params: DataScopeParams) => {
  return ApiClient.get<DataScopeResult[]>('/v1/sys/data-scopes', { params });
};

export const getDataScopesApi = async () => {
  return ApiClient.get<DataScopeResult[]>('/v1/sys/data-scopes/all');
};

export const getDataScopeRulesApi = async (pk: number) => {
  return ApiClient.get<DataScopeRulesResult>(`/v1/sys/data-scopes/${pk}/rules`);
};

export const createDataScopeApi = async (data: CreateDataScopeParams) => {
  return ApiClient.post('/v1/sys/data-scopes', data);
};

export const updateDataScopeApi = async (pk: number, data: CreateDataScopeParams) => {
  return ApiClient.put(`/v1/sys/data-scopes/${pk}`, data);
};

export const updateDataScopeRulesApi = async (pk: number, rules: number[]) => {
  return ApiClient.put(`/v1/sys/data-scopes/${pk}/rules`, { rules });
};

export const deleteDataScopeApi = async (pks: number[]) => {
  return ApiClient.delete('/v1/sys/data-scopes', { data: { pks } });
};

// 数据规则 API
export const getDataRuleListApi = async (params: DataRuleParams) => {
  return ApiClient.get<DataRuleResult[]>('/v1/sys/data-rules', { params });
};

export const getDataRulesApi = async () => {
  return ApiClient.get<DataRuleResult[]>('/v1/sys/data-rules/all');
};

export const getDataRuleModelsApi = async () => {
  return ApiClient.get<string[]>('/v1/sys/data-rules/models');
};

export const getDataRuleModelColumnsApi = async (model: string) => {
  return ApiClient.get<DataRuleModelColumnsResult[]>(`/v1/sys/data-rules/models/${model}/columns`);
};

export const createDataRuleApi = async (data: CreateDataRuleParams) => {
  return ApiClient.post('/v1/sys/data-rules', data);
};

export const updateDataRuleApi = async (pk: number, data: CreateDataRuleParams) => {
  return ApiClient.put(`/v1/sys/data-rules/${pk}`, data);
};

export const deleteDataRuleApi = async (pks: number[]) => {
  return ApiClient.delete('/v1/sys/data-rules', { data: { pks } });
};
