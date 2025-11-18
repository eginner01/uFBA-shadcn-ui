import { ApiClient } from './client';
import type { PageParams, PageResult } from '../types/api';

// 代码生成业务
export interface CodeGenBusiness {
  id: number;
  app_name: string;
  table_name: string;
  doc_comment: string;
  table_comment?: string;
  class_name?: string;
  schema_name?: string;
  filename?: string;
  default_datetime_column?: boolean;
  api_version?: string;
  gen_path?: string;
  remark?: string;
  created_time: string;
  updated_time?: string;
}

// 代码生成字段
export interface CodeGenColumn {
  id: number;
  name: string;
  comment?: string;
  type: string;
  default?: string;
  sort: number;
  length: number;
  is_pk: boolean;
  is_nullable: boolean;
  pd_type: string;
  gen_business_id: number;
}

// 查询参数
export interface CodeGenBusinessQueryParams extends Partial<PageParams> {
  table_name?: string;
}

// 导入参数
export interface ImportTableParams {
  app: string;
  table_schema: string;
  table_name: string;
}

// 获取业务列表
export const getCodeGenBusinessListApi = (params: CodeGenBusinessQueryParams) => {
  return ApiClient.get<PageResult<CodeGenBusiness>>('/v1/generates/businesses', { params });
};

// 获取业务详情
export const getCodeGenBusinessDetailApi = (id: number) => {
  return ApiClient.get<CodeGenBusiness>(`/v1/generates/businesses/${id}`);
};

// 更新业务
export const updateCodeGenBusinessApi = (id: number, data: Partial<CodeGenBusiness>) => {
  return ApiClient.put(`/v1/generates/businesses/${id}`, data);
};

// 删除业务
export const deleteCodeGenBusinessApi = (id: number) => {
  return ApiClient.delete(`/v1/generates/businesses/${id}`);
};

// 获取数据库表列表
export const getDbTablesApi = (params: { app?: string; table_schema?: string }) => {
  return ApiClient.get<string[]>('/v1/generates/codes/tables', { params });
};

// 导入表
export const importTableApi = (data: ImportTableParams) => {
  return ApiClient.post('/v1/generates/codes/imports', data);
};

// 获取业务字段列表
export const getBusinessColumnsApi = (businessId: number) => {
  return ApiClient.get<PageResult<CodeGenColumn>>(`/v1/generates/businesses/${businessId}/columns`);
};

// 预览代码
export const previewCodeApi = (businessId: number) => {
  return ApiClient.get<Record<string, string>>(`/v1/generates/codes/${businessId}/previews`);
};

// 生成代码
export const generateCodeApi = (businessId: number) => {
  return ApiClient.post(`/v1/generates/codes/${businessId}/generation`);
};

// 下载代码
export const downloadCodeApi = (businessId: number) => {
  return ApiClient.get(`/v1/generates/codes/${businessId}`, { responseType: 'blob' });
};
