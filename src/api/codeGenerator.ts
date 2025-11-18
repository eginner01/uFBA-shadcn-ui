import { ApiClient } from './client';

// 查询参数
export interface QueryCodeGenBusinessParams {
  table_name?: string;
  page?: number;
  size?: number;
}

// 业务参数
export interface CodeGenBusinessParams {
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
}

// 业务结果
export interface CodeGenBusinessResult extends CodeGenBusinessParams {
  id: number;
  created_time: string;
  updated_time: string;
}

// 导入参数
export interface CodeGenBusinessImportParams {
  app: string;
  table_schema: string;
  table_name: string;
}

// 获取业务列表
export const getCodeGenBusinessListApi = (params: QueryCodeGenBusinessParams) => {
  return ApiClient.get<{ items: CodeGenBusinessResult[]; total: number }>(
    '/v1/generates/businesses',
    { params }
  );
};

// 获取所有业�?
export const getAllCodeGenBusinessApi = () => {
  return ApiClient.get<CodeGenBusinessResult[]>('/v1/generates/businesses/all');
};

// 获取业务详情
export const getCodeGenBusinessDetailApi = (pk: number) => {
  return ApiClient.get<CodeGenBusinessResult>(`/v1/generates/businesses/${pk}`);
};

// 创建业务
export const createCodeGenBusinessApi = (data: CodeGenBusinessParams) => {
  return ApiClient.post('/v1/generates/businesses', data);
};

// 更新业务
export const updateCodeGenBusinessApi = (pk: number, data: CodeGenBusinessParams) => {
  return ApiClient.put(`/v1/generates/businesses/${pk}`, data);
};

// 删除业务
export const deleteCodeGenBusinessApi = (pk: number) => {
  return ApiClient.delete(`/v1/generates/businesses/${pk}`);
};

// 获取数据库表列表
export const getCodeGenDbTableApi = (params: { table_schema: string }) => {
  return ApiClient.get<string[]>('/v1/generates/codes/tables', { params });
};

// 导入数据库表
export const importCodeGenDbTableApi = (data: CodeGenBusinessImportParams) => {
  return ApiClient.post('/v1/generates/codes/imports', data);
};

// 预览代码
export const previewCodeGenApi = (pk: number) => {
  return ApiClient.get(`/v1/generates/codes/${pk}/previews`);
};

// 生成代码
export const generateCodeApi = (pk: number) => {
  return ApiClient.post(`/v1/generates/codes/${pk}/generation`);
};

// 下载代码
export const downloadCodeApi = (pk: number) => {
  return ApiClient.get(`/v1/generates/codes/${pk}`, { responseType: 'blob' });
};
